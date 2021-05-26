import { Collection, Db, ObjectId } from "mongodb";
import { DATABASE_INSTANCE_KEY } from "../config/index";
import { Arg, Field, ID, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import Container, { Service } from "typedi";
import { callbackify } from "util";
import {mqttClient} from "../mqtt"
import {MQTT_BRAND, MQTT_BROKER} from "../config";

@InputType("environmentUnitInput")
@ObjectType()
class environmentUnit{
    @Field(()=>[Number])
    data?: number[];
    @Field(()=>Number)
    threshold: number;
    @Field(()=>[Date])
    updateTime?: Date[]
}
@ObjectType()
class rainUnit{
    @Field(()=>[Boolean])
    data: boolean[];
    @Field(()=>[Date])
    updateTime?: Date[]
}
@ObjectType()
export class BorderDevice  {
    @Field(() => ID)
    _id: string;

    @Field({ nullable: true })
    name: string;
    
	@Field(()=>environmentUnit)
    temperature: environmentUnit;
    
	@Field(()=>environmentUnit)
    humidity: environmentUnit;
    
	@Field()
    rain: rainUnit;

	@Field(()=>environmentUnit)
    dust: environmentUnit;
    
	@Field(()=>environmentUnit)
    coGas: environmentUnit
    
	@Field(()=>environmentUnit)
    soilHumid: environmentUnit;

    @Field()
    cylinder: boolean;

    @Field()
    alert: boolean
    
	@Field(()=>[Number])
    lat: number[];

	@Field(()=>[Number])
    long: number[];

    @Field(()=>[Date])
    locationUpdateTime?: Date[];
} 


@InputType()
class BorderDeviceCreateInput {
    @Field()
    name: string;

	@Field(()=>environmentUnit,{ nullable: true })
    temperature: environmentUnit;
    
	@Field(()=>environmentUnit,{ nullable: true })
    humidity: environmentUnit;
    
	@Field({ nullable: true })
    rain: rainUnit;

	@Field(()=>environmentUnit,{ nullable: true })
    dust: environmentUnit;
    
	@Field(()=>environmentUnit,{ nullable: true })
    coGas: environmentUnit;
    
	@Field(()=>environmentUnit,{ nullable: true })
    soilHumid: environmentUnit;

    @Field({ nullable: true })
    cylinder: boolean;

    @Field()
    alert: boolean

    @Field(()=>[Number],{ nullable: true })
    lat: number[];

	@Field(()=>[Number],{ nullable: true })
    long: number[];
    
    @Field(()=>[Date])
    locationUpdateTime?: Date[];
}

@InputType()
class BorderDeviceUpdateInput {
    @Field(() => ID)
    _id: string;

    @Field({ nullable: true })
    name: string;

	@Field(()=>environmentUnit, { nullable: true })
    temperature: environmentUnit;
    
	@Field(()=>environmentUnit, { nullable: true })
    humidity: environmentUnit;
    
	@Field({ nullable: true })
    rain: rainUnit;

	@Field(()=>environmentUnit, { nullable: true })
    dust: environmentUnit;
    
	@Field(()=>environmentUnit, { nullable: true })
    coGas: environmentUnit;
    
	@Field(()=>environmentUnit, { nullable: true })
    soilHumid: environmentUnit;

    @Field({ nullable: true })
    cylinder:boolean

    @Field()
    alert: boolean
    
    @Field(()=>[Number],{ nullable: true })
    lat: number[];

	@Field(()=>[Number],{ nullable: true })
    long: number[];

    @Field(()=>[Date])
    locationUpdateTime: Date[];
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
    async getBorderDevice(@Arg("id") id: number) {
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
                        threshold: 1000
                    }, 
                    humidity: {
                        threshold: 1000
                    },  
                    rain: {
                        data: [],
                    },
                    dust: {
                        threshold: 1000
                    }, 
                    coGas: {
                        threshold: 1000
                    },  
                    soilHumid: {
                        threshold: 1000
                    }, 
                    cylinder: true,
                    alert: false,
                });
        console.log("Current status:")
        console.log(existDevice);
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
                    MQTT_BRAND + "/thap_bien_gioi/" + existDevice.name + "/environment/temperature/threshold", 
                    temperatureThreshold, 
                    {qos: 2});
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
                    MQTT_BRAND + "/thap_bien_gioi/" + existDevice.name + "/environment/humidity/threshold", 
                    humidityThreshold, 
                    {qos: 2});
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
                    MQTT_BRAND + "/thap_bien_gioi/" + existDevice.name + "/environment/dust/threshold", 
                    dustThreshold, 
                    {qos: 2});
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
                    MQTT_BRAND + "/thap_bien_gioi/" + existDevice.name + "/environment/co_gas/threshold", 
                    coGasThreshold, 
                    {qos: 2});
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
                    MQTT_BRAND + "/thap_bien_gioi/" + existDevice.name + "/environment/soil_humid/threshold", 
                    soilHumidThreshold, 
                    {qos: 2});
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
                let cylinderStatus = (payload=='true')?true:false;
                device.updateOne({name: BorderDeviceName}, {$set: {cylinder: cylinderStatus}}, (err, result)=>{
                    if (err)
                    {
                        console.log(err);
                        return err;
                    }
                    console.log("Cylinder Status updated!");
                })
                break;
            case 'alert':
                let alertStatus = (payload=='true')?true:false;
                device.updateOne({name: BorderDeviceName}, {$set: {alert: alertStatus}}, (err, result)=>{
                    if (err)
                    {
                        console.log(err);
                        return err;
                    }
                    console.log("Alert updated!");
                })
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
    async cylinderUp(@Arg("id") id: number) {
        const existDevice = await this.db.collection("BorderDevices").findOne({ _id: id});
        if (!existDevice){
                console.error("Khong tim thay thiet bi!");
                return {}
            }
        // publish mqtt mesage
        let publishTopic = MQTT_BRAND + "/thap_bien_gioi/" + existDevice.name + "/device/cylinder" 
        mqttClient.publish(publishTopic, "true", {qos: 2})
        
        const device = this.db.collection("BorderDevices");
        device.updateOne({ _id: id},{$set: {cylinder: true}}, (err, result)=>{
            if (err)
            {
                console.log(err);
                return err;
            }
            console.log("Cylinder Up!");
        })
        return existDevice;
    }

    @Mutation(()=>BorderDevice)
    async cylinderDown(@Arg("id") id: number) {
        const existDevice = await this.db.collection("BorderDevices").findOne({ _id: id});
        if (!existDevice){
                console.error("Khong tim thay thiet bi!");
                return {}
            }
        // publish mqtt mesage
        let publishTopic = MQTT_BRAND + "/thap_bien_gioi/" + existDevice.name + "/device/cylinder" 
        mqttClient.publish(publishTopic, "false", {qos: 2})
        
        const device = this.db.collection("BorderDevices");
        device.updateOne({ _id: id},{$set: {cylinder: false}}, (err, result)=>{
            if (err)
            {
                console.log(err);
                return err;
            }
            console.log("Cylinder Down!");
        })
        return existDevice;
    }

    @Mutation(()=>BorderDevice)
    async sendAlert(@Arg("id") id: number){
        const existDevice = await this.db.collection("BorderDevices").findOne({ _id: id});
        if (!existDevice){
                console.error("Khong tim thay thiet bi!");
                return {}
            }
        // publish mqtt mesage
        let publishTopic = MQTT_BRAND + "/thap_bien_gioi/" + existDevice.name + "/device/alert" 
        mqttClient.publish(publishTopic, "true", {qos: 2})

        const device = this.db.collection("BorderDevices");
        device.updateOne({ _id: id},{$set: {alert: true}}, (err, result)=>{
            if (err)
            {
                console.log(err);
                return err;
            }
            console.log("Alert sent!");
        })
        return existDevice;
    }

    @Mutation(()=>BorderDevice)
    async setThreshold(@Arg("id") id: number, @Arg("property") property: string, @Arg("Value") value: number){
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
