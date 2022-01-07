import { Collection, Db, ObjectId } from "mongodb";
import { DATABASE_INSTANCE_KEY } from "../config/index";
import { Arg, Field, ID, InputType, Mutation, ObjectType, Query, Resolver, registerEnumType } from "type-graphql";
import Container, { Service } from "typedi";
import { callbackify } from "util";
import { mqttClient } from "../mqtt"
import {MQTT_BRAND, MQTT_BROKER} from "../config";
import { INSPECT_MAX_BYTES } from "buffer";

@InputType("environmentUnitInput")
@ObjectType()
class EnvironmentUnit{
    @Field(()=>[Number], { nullable: true })
    data?: number[];
    @Field(()=>Number, { nullable: true })
    threshold?: number;
    @Field(()=>[Date], { nullable: true })
    updateTime?: Date[]
}
@InputType("rainUnitInput")
@ObjectType()
class RainUnit{
    @Field(()=>[Boolean], { nullable: true })
    data: boolean[];
    @Field(()=>[Date], { nullable: true })
    updateTime?: Date[]
}
export enum CylinderStatus{
    UP = 'up',
    DOWN = 'down',
    STOP = 'stop'
}
registerEnumType(CylinderStatus, {
    name: "CylinderStatus",
})
@ObjectType()
export class BorderDevice  {
    @Field(() => ID)
    _id: string;

    @Field({ nullable: true })
    name: string;
    
	@Field(()=>EnvironmentUnit, { nullable: true })
    temperature: EnvironmentUnit;
    
	@Field(()=>EnvironmentUnit, { nullable: true })
    humidity: EnvironmentUnit;
    
	@Field({ nullable: true })
    rain: RainUnit;

	@Field(()=>EnvironmentUnit, { nullable: true })
    dust: EnvironmentUnit;
    
	@Field(()=>EnvironmentUnit, { nullable: true })
    coGas: EnvironmentUnit
    
	@Field(()=>EnvironmentUnit, { nullable: true })
    soilHumid: EnvironmentUnit;

    @Field(()=>CylinderStatus, { nullable: true })
    cylinder: CylinderStatus;

    @Field({ nullable: true })
    alert: boolean
    
	@Field(()=>[Number], { nullable: true })
    lat: number[];

	@Field(()=>[Number], { nullable: true })
    long: number[];

    @Field(()=>[Date], { nullable: true })
    locationUpdateTime?: Date[];
} 


@InputType()
class BorderDeviceCreateInput {
    @Field({ nullable: true })
    name: string;

	@Field(()=>EnvironmentUnit,{ nullable: true })
    temperature: EnvironmentUnit;
    
	@Field(()=>EnvironmentUnit,{ nullable: true })
    humidity: EnvironmentUnit;
    
	@Field({ nullable: true })
    rain: RainUnit;

	@Field(()=>EnvironmentUnit,{ nullable: true })
    dust: EnvironmentUnit;
    
	@Field(()=>EnvironmentUnit,{ nullable: true })
    coGas: EnvironmentUnit;
    
	@Field(()=>EnvironmentUnit,{ nullable: true })
    soilHumid: EnvironmentUnit;

    @Field(()=>CylinderStatus, { nullable: true })
    cylinder: CylinderStatus;

    @Field({ nullable: true })
    alert: boolean

    @Field(()=>[Number],{ nullable: true })
    lat: number[];

	@Field(()=>[Number],{ nullable: true })
    long: number[];
    
    @Field(()=>[Date], { nullable: true })
    locationUpdateTime?: Date[];
}
interface LocationDataType{
    long: number,
    lat: number,
}
@Resolver()
@Service()
export class BorderDevices {
    db: Db
    constructor() {
        this.db = (Container.get(DATABASE_INSTANCE_KEY) as any);
    }
    @Mutation(() => BorderDevice)
    async createBorderDevice(@Arg("input", {nullable: true}) inputs: BorderDeviceCreateInput) {
        const id = new ObjectId();
        const result = await this.db.collection("BorderDevices").insertOne({
            _id: id.toHexString(),
            lastUpdated: id.getTimestamp(),
            ...inputs
        })
        return result.ops[0];
    }

    @Query(() => BorderDevice)
    async getBorderDevice(@Arg("id") id: string) {
        const result = await this.db.collection("BorderDevices").findOne({ _id: id});
        console.log(result);
        return result;
    }
    
    @Mutation(()=>BorderDevice)
    async mqttMessageHandler(
        @Arg("name") BorderDeviceName: string,
        @Arg("data") payload: string,
        @Arg("topic") topic: string
    ){
        let existDevice = await this.db.collection("BorderDevices").findOne({name: BorderDeviceName});
        if (!existDevice)
            existDevice = this.createBorderDevice(
                {
                    name: BorderDeviceName, 
                    lat: [], 
                    long: [], 
                    temperature: {
                        threshold: 1000,
                        data: [],
                        updateTime: [],
                    }, 
                    humidity: {
                        threshold: 1000,
                        data: [],
                        updateTime: [],
                    },  
                    rain: {
                        data: [],
                        updateTime: []
                    },
                    dust: {
                        threshold: 1000,
                        data: [],
                        updateTime: []
                    }, 
                    coGas: {
                        threshold: 1000,
                        data: [],
                        updateTime: [],
                    },  
                    soilHumid: {
                        threshold: 1000,
                        data: [],
                        updateTime: [],
                    }, 
                    cylinder: CylinderStatus.STOP,
                    alert: false,
                });
        console.log("Current status:")
        const device = this.db.collection("BorderDevices");
        switch (topic){
            case 'temperature':
                device.updateOne(
                    {name: BorderDeviceName}, 
                    {$push: {"temperature.data": parseFloat(payload), "temperature.updateTime" : new Date()}}, 
                    (err, result)=>{
                        if (err)
                        {
                            console.log(err);
                            return err;
                            
                        }
                        console.log("temp updated!");
                    })
                let temperatureThreshold = "true";
                if (parseFloat(payload)>existDevice.temperature.threshold)
                    temperatureThreshold = "false";
                mqttClient.publish(
                    MQTT_BRAND + "/thap_bien_gioi/" + existDevice.name + "/environment/temperature/$threshold/set", 
                    temperatureThreshold, 
                    {qos: 2, retain: true});
                break;
            case 'humidity':
                device.updateOne(
                    {name: BorderDeviceName}, 
                    {$push: {"humidity.data": parseFloat(payload), "humidity.updateTime": new Date()}}, 
                    (err, result)=>{
                        if (err)
                        {
                            console.log(err);
                            return err;
                        }
                        console.log("humid updated!");
                    })
                let humidityThreshold = "true";
                if (parseFloat(payload)>existDevice.humidity.threshold)
                    humidityThreshold = "false";
                mqttClient.publish(
                    MQTT_BRAND + "/thap_bien_gioi/" + existDevice.name + "/environment/humidity/$threshold/set", 
                    humidityThreshold, 
                    {qos: 2, retain: true});
                break;
            case 'dust':
                device.updateOne(
                    {name: BorderDeviceName}, 
                    {$push: {"dust.data": parseFloat(payload), "dust.updateTime" : new Date()}}, 
                    (err, result)=>{
                        if (err)
                        {
                            console.log(err);
                            return err;
                        }
                        console.log("dust updated!");
                    })
                let dustThreshold = "true";
                if (parseFloat(payload)>existDevice.dust.threshold)
                    dustThreshold = "false";
                mqttClient.publish(
                    MQTT_BRAND + "/thap_bien_gioi/" + existDevice.name + "/environment/dust/$threshold/set", 
                    dustThreshold, 
                    {qos: 2, retain: true});
                break;
            case 'rain':
                let rainStatus = (payload=='true')?true:false;
                device.updateOne(
                    {name: BorderDeviceName}, 
                    {$push: {"rain.data": rainStatus, "rain.updateTime" : new Date()}}, 
                    (err, result)=>{
                        if (err)
                        {
                            console.log(err);
                            return err;
                        }
                        console.log("rain updated!");
                    })
                break;
            case 'co_gas':
                device.updateOne(
                    {name: BorderDeviceName}, 
                    {$push: {"coGas.data": parseFloat(payload), "coGas.updateTime" : new Date()}}, 
                    (err, result)=>{
                        if (err)
                        {
                            console.log(err);
                            return err;
                        }
                        console.log("CO gas updated!");
                    })
                let coGasThreshold = "true";
                if (parseFloat(payload)>existDevice.coGas.threshold)
                    coGasThreshold = "false";
                mqttClient.publish(
                    MQTT_BRAND + "/thap_bien_gioi/" + existDevice.name + "/environment/co_gas/$threshold/set", 
                    coGasThreshold, 
                    {qos: 2, retain: true});
                break;
            case 'soil_humid':
                device.updateOne(
                    {name: BorderDeviceName}, 
                    {$push: {"soilHumid.data": parseFloat(payload), "soilHumid.updateTime" : new Date()}}, 
                    (err, result)=>{
                        if (err)
                        {
                            console.log(err);
                            return err;
                        }
                        console.log("Soil Humid updated!");
                    })
                let soilHumidThreshold = "true";
                if (parseFloat(payload)>existDevice.soilHumid.threshold)
                    soilHumidThreshold = "false";
                mqttClient.publish(
                    MQTT_BRAND + "/thap_bien_gioi/" + existDevice.name + "/environment/soil_humid/$threshold/set", 
                    soilHumidThreshold, 
                    {qos: 2, retain: true});
                break;
            case 'location':
                let locationData: LocationDataType;
                if (typeof payload == 'string'){
                    locationData = JSON.parse(payload);
                    device.updateOne({name: BorderDeviceName}, {$push: {long: locationData.long}}, (err, result)=>{
                        if (err)
                        {
                            console.log(err);
                            return err;
                        }
                        console.log("long location updated!");
                    })
                    device.updateOne({name: BorderDeviceName}, {$push: {lat: locationData.lat}}, (err, result)=>{
                        if (err)
                        {
                            console.log(err);
                            return err;
                        }
                        console.log("lat location updated!");
                    })
                    device.updateOne({name: BorderDeviceName}, {$push: {locationUpdateTime: new Date()}}, (err, result)=>{
                        if (err)
                        {
                            console.log(err);
                            return err;
                        }
                        console.log("Location Time updated!");
                    })
                }
                else 
                    console.error("Du lieu location khong hop le!");
                break;
            case 'cylinder':
                if ((<any>Object).values(CylinderStatus).includes(payload))
                    device.updateOne({name: BorderDeviceName}, {$set: {cylinder: payload}}, (err, result)=>{
                        if (err)
                        {
                            console.log(err);
                            return err;
                        }
                        console.log("Cylinder Status updated!");
                    });
                else{
                    console.error("CylinderStatus khong hop le!");
                }
                break;
            case 'alert':
                if (payload=='true'){
                    device.updateOne({name: BorderDeviceName}, {$set: {alert: true}}, (err, result)=>{
                        if (err)
                        {
                            console.log(err);
                            return err;
                        }
                        console.log("Alert updated!");
                    })
                    // Alert = False after 5m
                    setTimeout(()=>{
                        device.updateOne({name: BorderDeviceName},{$set: {alert: false}}, (err, result)=>{
                            if (err)
                            {
                                console.log(err);
                                return err;
                            }
                            console.log("Alert Disabled")
                        })
                        let alertTopic = MQTT_BRAND + "/thap_bien_gioi/" + existDevice.name + "/device/alert/set" 
                        mqttClient.publish(alertTopic, "false", {qos: 2, retain: true});
                    }, 300000);
                }
                break;
            case 'threshold':
                break;
            default: 
                console.error(topic + ": Topic khong khop!");
        }
        console.log("Updated:")
        console.log(existDevice);
        return existDevice;
    }

    @Mutation(()=>BorderDevice)
    async updateBorderCylinderStatus(@Arg("id") id: string, @Arg("status") status: CylinderStatus) {
        const existDevice = await this.db.collection("BorderDevices").findOne({ _id: id});
        if (!existDevice){
                console.error("Khong tim thay thiet bi!");
                return {}
            }
        // publish mqtt mesage
        let publishTopic = MQTT_BRAND + "/thap_bien_gioi/" + existDevice.name + "/device/cylinder/set" 
        mqttClient.publish(publishTopic, status, {qos: 2, retain: true});
        
        const device = this.db.collection("BorderDevices");
        device.updateOne({ _id: id},{$set: {cylinder: status}}, (err, result)=>{
            if (err)
            {
                console.log(err);
                return err;
            }
            console.log("Cylinder updated!");
        })
        return existDevice;
    }

    @Mutation(()=>BorderDevice)
    async sendAlert(@Arg("id") id: string){
        const existDevice = await this.db.collection("BorderDevices").findOne({ _id: id});
        if (!existDevice){
                console.error("Khong tim thay thiet bi!");
                return {}
            }

        // publish mqtt mesage
        let publishTopic = MQTT_BRAND + "/thap_bien_gioi/" + existDevice.name + "/device/alert/set" 
        mqttClient.publish(publishTopic, "true", {qos: 2, retain: true})

        const device = this.db.collection("BorderDevices");
        device.updateOne({ _id: id},{$set: {alert: true}}, (err, result)=>{
            if (err)
            {
                console.log(err);
                return err;
            }
            console.log("Alert sent!");
        })
        // Alert = False after 5m
        setTimeout(()=>{
            device.updateOne({ _id: id},{$set: {alert: false}}, (err, result)=>{
                if (err)
                {
                    console.log(err);
                    return err;
                }
                console.log("Alert Disabled")
            })
            mqttClient.publish(publishTopic, "false", {qos: 2, retain: true});
        }, 300000);
        return existDevice;
    }

    @Mutation(()=>BorderDevice)
    async setBorderThreshold(@Arg("id") id: string, @Arg("property") property: string, @Arg("value") value: number){
        const existDevice = await this.db.collection("BorderDevices").findOne({ _id: id});
        if (!existDevice){
                console.error("Khong tim thay thiet bi!");
                return {}
            }
        const device = this.db.collection("BorderDevices");
        switch (property){
            case 'temperature':
                device.updateOne( {_id: id}, {$set: {"temperature.threshold": value}}, (err, result)=>{
                        if (err)
                        {
                            console.log(err);
                            return err;
                            
                        }
                        console.log("temp threshold updated!");
                    })
                break;
            case 'humidity':
                device.updateOne( {_id: id}, {$set: {"humidity.threshold": value}}, (err, result)=>{
                    if (err)
                    {
                        console.log(err);
                        return err;
                        
                    }
                    console.log("humidity threshold updated!");
                })
                break;
            case 'dust':
                device.updateOne( {_id: id}, {$set: {"dust.threshold": value}}, (err, result)=>{
                    if (err)
                    {
                        console.log(err);
                        return err;
                        
                    }
                    console.log("dust threshold updated!");
                })
                break;
            case 'coGas':
                device.updateOne( {_id: id}, {$set: {"coGas.threshold": value}}, (err, result)=>{
                    if (err)
                    {
                        console.log(err);
                        return err;
                        
                    }
                    console.log("coGas threshold updated!");
                })
                break;
            case 'soilHumid':
                device.updateOne( {_id: id}, {$set: {"soilHumid.threshold": value}}, (err, result)=>{
                    if (err)
                    {
                        console.log(err);
                        return err;
                        
                    }
                    console.log("soilHumid threshold updated!");
                })
                break;
        }
        return existDevice;
    }

    @Query(() => [BorderDevice])
    async getBorderDevices() {
        const result = this.db.collection("BorderDevices").find();
        return await result.toArray();
    }
}
