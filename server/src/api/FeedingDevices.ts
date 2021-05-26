import { Collection, Db, ObjectId } from "mongodb";
import { DATABASE_INSTANCE_KEY } from "../config/index";
import { Arg, Field, ID, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import Container, { Service } from "typedi";
import { callbackify } from "util";
import {mqttClient} from "../mqtt"
import {MQTT_BRAND, MQTT_BROKER} from "../config";

@InputType("environmentFeedingUnitInput")
@ObjectType()
class environmentFeedingUnit{
    @Field(()=>[Number])
    data: number[];
    @Field(()=>Number, {nullable:true})
    threshold?: number;
}
@ObjectType()
export class FeedingDevice  {
    @Field(() => ID)
    _id: string;

    @Field({ nullable: true })
    name: string;
    
	@Field(()=>environmentFeedingUnit)
    temperature: environmentFeedingUnit;
    
	@Field(()=>environmentFeedingUnit)
    o2Gas: environmentFeedingUnit;
    
	@Field(()=>environmentFeedingUnit)
    pH: environmentFeedingUnit;
    
    @Field()
    foodCan: boolean;

    @Field()
    foodTray: boolean;

    @Field()
    fan: boolean
    
    @Field(()=>[Date],{ nullable: true })
    updateTime: Date[];    
} 


@InputType()
class FeedingDeviceCreateInput {
    @Field()
    name: string;

	@Field(()=>environmentFeedingUnit,{ nullable: true })
    temperature: environmentFeedingUnit;
    
	@Field(()=>environmentFeedingUnit,{ nullable: true })
    o2Gas: environmentFeedingUnit;
    
	@Field(()=>environmentFeedingUnit,{ nullable: true })
    pH: environmentFeedingUnit;
    
    @Field({ nullable: true })
    foodCan: boolean;

    @Field({ nullable: true })
    foodTray: boolean;

    @Field()
    fan: boolean

    @Field(()=>[Date],{ nullable: true })
    updateTime: Date[];
}

@InputType()
class FeedingDeviceUpdateInput {
    @Field(() => ID)
    _id: string;

    @Field({ nullable: true })
    name: string;

	@Field(()=>environmentFeedingUnit, { nullable: true })
    temperature: environmentFeedingUnit;
    
	@Field(()=>environmentFeedingUnit, { nullable: true })
    humidity: environmentFeedingUnit;
    
	@Field({ nullable: true })
    rain: boolean;

	@Field(()=>environmentFeedingUnit, { nullable: true })
    dust: environmentFeedingUnit;
    
	@Field(()=>environmentFeedingUnit, { nullable: true })
    coGas: environmentFeedingUnit;
    
	@Field(()=>environmentFeedingUnit, { nullable: true })
    soilHumid: environmentFeedingUnit;

    @Field({ nullable: true })
    cylinder:boolean

    @Field()
    alert: boolean

    @Field(()=>[Date],{ nullable: true })
    updateTime: Date[];
    
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
export class FeedingDevices {
    db: Db
    constructor() {
        this.db = (Container.get(DATABASE_INSTANCE_KEY) as any);
    }
    @Mutation(() => FeedingDevice)
    async createFeedingDevice(@Arg("input", {nullable: true}) inputs: FeedingDeviceCreateInput) {
        const id = new ObjectId();
        const result = await this.db.collection("FeedingDevices").insertOne({
            _id: id.toHexString(),
            lastUpdated: id.getTimestamp(),
            ...inputs
        })
        return result.ops[0];
    }

    @Query(() => FeedingDevice)
    async getFeedingDevice(@Arg("id") id: number) {
        const result = await this.db.collection("FeedingDevices").findOne({ _id: id});
        console.log(result);
        return result;
    }
    @Mutation(()=>FeedingDevice)
    async mqttMessageHandler(
        @Arg("name") FeedingDeviceName: string,
        @Arg("data") payload: string,
        @Arg("topic") topic: string
    ){
        let existDevice = await this.db.collection("FeedingDevices").findOne({name: FeedingDeviceName});
        if (!existDevice)
            existDevice = this.createFeedingDevice(
                {
                    name: FeedingDeviceName, 
                    temperature: {
                        data: [],
                        threshold: 1000
                    }, 
                    o2Gas: {
                        data: [],
                        threshold: 1000
                    },  
                    pH: {
                        data: [],
                        threshold: 1000
                    }, 
                    foodCan: true,
                    foodTray: false,
                    fan: false,
                    updateTime: [],
                });
        console.log("Current status:")
        console.log(existDevice);
        const device = this.db.collection("FeedingDevices");
        switch (topic){
            case 'temperature':
                device.updateOne({name: FeedingDeviceName}, {$push: {"temperature.data": parseFloat(payload)}}, (err, result)=>{
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
                    MQTT_BRAND + "/thap_bien_gioi/" + existDevice.name + "/device/temperature/threshold", 
                    temperatureThreshold, 
                    {qos: 2});
                break;
            case 'humidity':
                device.updateOne({name: FeedingDeviceName}, {$push: {"humidity.data": parseFloat(payload)}}, (err, result)=>{
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
                    MQTT_BRAND + "/thap_bien_gioi/" + existDevice.name + "/device/humidity/threshold", 
                    humidityThreshold, 
                    {qos: 2});
                break;
            case 'dust':
                device.updateOne({name: FeedingDeviceName}, {$push: {"dust.data": parseFloat(payload)}}, (err, result)=>{
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
                    MQTT_BRAND + "/thap_bien_gioi/" + existDevice.name + "/device/dust/threshold", 
                    dustThreshold, 
                    {qos: 2});
                break;
            case 'rain':
                let rainStatus = (payload=='true')?true:false;
                device.updateOne({name: FeedingDeviceName}, {$push: {rain: rainStatus}}, (err, result)=>{
                    if (err)
                    {
                        console.log(err);
                        return err;
                    }
                    console.log("rain updated!");
                })
                break;
            case 'co_gas':
                device.updateOne({name: FeedingDeviceName}, {$push: {"coGas.data": parseFloat(payload)}}, (err, result)=>{
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
                    MQTT_BRAND + "/thap_bien_gioi/" + existDevice.name + "/device/co_gas/threshold", 
                    coGasThreshold, 
                    {qos: 2});
                break;
            case 'soil_humid':
                device.updateOne({name: FeedingDeviceName}, {$push: {"soilHumid.data": parseFloat(payload)}}, (err, result)=>{
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
                    MQTT_BRAND + "/thap_bien_gioi/" + existDevice.name + "/device/soil_humid/threshold", 
                    soilHumidThreshold, 
                    {qos: 2});
                device.updateOne({name: FeedingDeviceName}, {$push: {updateTime: new Date()}}, (err, result)=>{
                    if (err)
                    {
                        console.log(err);
                        return err;
                    }
                    console.log("Time updated!");
                })
                break;
            case 'location':
                let locationData: LocationDataType;
                if (typeof payload == 'string'){
                    locationData = JSON.parse(payload);
                    device.updateOne({name: FeedingDeviceName}, {$push: {long: locationData.long}}, (err, result)=>{
                        if (err)
                        {
                            console.log(err);
                            return err;
                        }
                        console.log("long location updated!");
                    })
                    device.updateOne({name: FeedingDeviceName}, {$push: {lat: locationData.lat}}, (err, result)=>{
                        if (err)
                        {
                            console.log(err);
                            return err;
                        }
                        console.log("lat location updated!");
                    })
                    device.updateOne({name: FeedingDeviceName}, {$push: {locationUpdateTime: new Date()}}, (err, result)=>{
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
                device.updateOne({name: FeedingDeviceName}, {$set: {cylinder: cylinderStatus}}, (err, result)=>{
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
                device.updateOne({name: FeedingDeviceName}, {$set: {alert: alertStatus}}, (err, result)=>{
                    if (err)
                    {
                        console.log(err);
                        return err;
                    }
                    console.log("Alert updated!");
                })
                break;
            case 'threshold':
                
            default: 
                console.error(topic + ": Topic khong khop!");
        }
        console.log("Updated:")
        console.log(existDevice);
        return existDevice;
    }
    @Mutation(()=>FeedingDevice)
    async cylinderUp(@Arg("id") id: number) {
        const existDevice = await this.db.collection("FeedingDevices").findOne({ _id: id});
        if (!existDevice){
                console.error("Khong tim thay thiet bi!");
                return {}
            }
        // publish mqtt mesage
        let publishTopic = MQTT_BRAND + "/thap_bien_gioi/" + existDevice.name + "/device/cylinder" 
        mqttClient.publish(publishTopic, "true", {qos: 2})
        
        const device = this.db.collection("FeedingDevices");
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
    @Mutation(()=>FeedingDevice)
    async cylinderDown(@Arg("id") id: number) {
        const existDevice = await this.db.collection("FeedingDevices").findOne({ _id: id});
        if (!existDevice){
                console.error("Khong tim thay thiet bi!");
                return {}
            }
        // publish mqtt mesage
        let publishTopic = MQTT_BRAND + "/thap_bien_gioi/" + existDevice.name + "/device/cylinder" 
        mqttClient.publish(publishTopic, "false", {qos: 2})
        
        const device = this.db.collection("FeedingDevices");
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
    @Mutation(()=>FeedingDevice)
    async sendAlert(@Arg("id") id: number){
        const existDevice = await this.db.collection("FeedingDevices").findOne({ _id: id});
        if (!existDevice){
                console.error("Khong tim thay thiet bi!");
                return {}
            }
        // publish mqtt mesage
        let publishTopic = MQTT_BRAND + "/thap_bien_gioi/" + existDevice.name + "/device/alert" 
        mqttClient.publish(publishTopic, "true", {qos: 2})

        const device = this.db.collection("FeedingDevices");
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
    @Query(() => [FeedingDevice])
    async getFeedingDevices() {
        const result = this.db.collection("FeedingDevices").find();
        return await result.toArray();
    }
}