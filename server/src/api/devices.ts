import { Collection, Db, ObjectId } from "mongodb";
import { DATABASE_INSTANCE_KEY } from "../config/index";
import { Arg, Field, ID, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import Container, { Service } from "typedi";
import { callbackify } from "util";
import {mqttClient} from "../mqtt"
import {MQTT_BRAND, MQTT_BROKER} from "../config";

@ObjectType()
export class Device {
    @Field(() => ID)
    _id: string;

    @Field({ nullable: true })
    name: string;

	@Field(()=>[Number])
    lat: number[];

	@Field(()=>[Number])
    long: number[];
    
	@Field(()=>[Number])
    temperature: number[];
    
	@Field(()=>[Number])
    humidity!: number[];
    
	@Field(()=>[Number])
    rain: number[];

	@Field(()=>[Number])
    dust: number[];
    
	@Field(()=>[Number])
    coGas: number[];
    
	@Field(()=>[Number])
    soilHumid: number[];

    @Field()
    upButton: boolean;

    @Field()
    downButton: boolean;

    @Field({ nullable: true })
    lastUpdated: Date;

    @Field()
    alertButton: boolean
} 


@InputType()
class DeviceCreateInput {
    @Field()
    name: string;

	@Field(()=>[Number],{ nullable: true })
    lat: number[];

	@Field(()=>[Number],{ nullable: true })
    long: number[];
    
	@Field(()=>[Number],{ nullable: true })
    temperature: number[];
    
	@Field(()=>[Number],{ nullable: true })
    humidity: number[];
    
	@Field(()=>[Number],{ nullable: true })
    rain: number[];

	@Field(()=>[Number],{ nullable: true })
    dust: number[];
    
	@Field(()=>[Number],{ nullable: true })
    coGas: number[];
    
	@Field(()=>[Number],{ nullable: true })
    soilHumid: number[];

    @Field({ nullable: true })
    upButton: boolean;

    @Field({ nullable: true })
    downButton: boolean;

    @Field()
    alertButton: boolean
}

@InputType()
class DeviceUpdateInput {
    @Field(() => ID)
    _id: string;

    @Field({ nullable: true })
    name: string;

	@Field(()=>[Number], { nullable: true })
    lat: number[];

	@Field(()=>[Number], { nullable: true })
    long: number[];
    
	@Field(()=>[Number], { nullable: true })
    temperature: number[];
    
	@Field(()=>[Number], { nullable: true })
    humidity: number[];
    
	@Field(()=>[Number], { nullable: true })
    rain: number[];

	@Field(()=>[Number], { nullable: true })
    dust: number[];
    
	@Field(()=>[Number], { nullable: true })
    coGas: number[];
    
	@Field(()=>[Number], { nullable: true })
    soilHumid: number[];

    @Field({ nullable: true })
    upButton: boolean;

    @Field({ nullable: true })
    downButton: boolean;

    @Field()
    alertButton: boolean
}

interface LocationDataType{
    long: number,
    lat: number,
    time: Date,
}
@Resolver()
@Service()
export class Devices {
    db: Db
    constructor() {
        this.db = (Container.get(DATABASE_INSTANCE_KEY) as any);
    }
    @Mutation(() => Device)
    async createDevice(@Arg("input", {nullable: true}) inputs: DeviceCreateInput) {
        const id = new ObjectId();
        const result = await this.db.collection("devices").insertOne({
            _id: id.toHexString(),
            lastUpdated: id.getTimestamp(),
            ...inputs
        })
        return result.ops[0];
    }

    @Query(() => Device)
    async getDevice(@Arg("id") id: number) {
        const result = await this.db.collection("devices").findOne({ _id: id});
        console.log(result);
        return result;
    }
    @Mutation(()=>Device)
    async mqttMessageHandler(
        @Arg("name") deviceName: string,
        @Arg("data") payload: string,
        @Arg("topic") topic: string
    ){
        let existDevice = await this.db.collection("devices").findOne({name: deviceName});
        if (!existDevice)
            existDevice = this.createDevice(
                {
                    name: deviceName, 
                    lat: [], 
                    long: [], 
                    temperature: [], 
                    humidity: [], 
                    rain: [], 
                    dust: [], 
                    coGas: [], 
                    soilHumid: [],
                    upButton: true,
                    downButton: false,
                    alertButton: false
                });
        console.log("Current status:")
        console.log(existDevice);
        const device = this.db.collection("devices");
        switch (topic){
            case 'temperature':
                device.updateOne({name: deviceName}, {$push: {temperature: parseFloat(payload)}}, (err, result)=>{
                    if (err)
                    {
                        console.log(err);
                        return err;
                    }
                    console.log("temp updated!");
                })
                break;
            case 'humidity':
                device.updateOne({name: deviceName}, {$push: {humidity: parseFloat(payload)}}, (err, result)=>{
                    if (err)
                    {
                        console.log(err);
                        return err;
                    }
                    console.log("humid updated!");
                })
                break;
            case 'dust':
                device.updateOne({name: deviceName}, {$push: {dust: parseFloat(payload)}}, (err, result)=>{
                    if (err)
                    {
                        console.log(err);
                        return err;
                    }
                    console.log("dust updated!");
                })
                break;
            case 'rain':
                device.updateOne({name: deviceName}, {$push: {rain: parseFloat(payload)}}, (err, result)=>{
                    if (err)
                    {
                        console.log(err);
                        return err;
                    }
                    console.log("rain updated!");
                })
                break;
            case 'co_gas':
                device.updateOne({name: deviceName}, {$push: {coGas: parseFloat(payload)}}, (err, result)=>{
                    if (err)
                    {
                        console.log(err);
                        return err;
                    }
                    console.log("CO gas updated!");
                })
                break;
            case 'soil_humid':
                device.updateOne({name: deviceName}, {$push: {soilHumid: parseFloat(payload)}}, (err, result)=>{
                    if (err)
                    {
                        console.log(err);
                        return err;
                    }
                    console.log("Soil Humid updated!");
                })
                break;
            case 'location':
                let locationData: LocationDataType;
                if (typeof payload == 'string'){
                    locationData = JSON.parse(payload);
                    device.updateOne({name: deviceName}, {$push: {long: locationData.long}}, (err, result)=>{
                        if (err)
                        {
                            console.log(err);
                            return err;
                        }
                        console.log("long location updated!");
                    })
                    device.updateOne({name: deviceName}, {$push: {lat: locationData.lat}}, (err, result)=>{
                        if (err)
                        {
                            console.log(err);
                            return err;
                        }
                        console.log("lat location updated!");
                    })
                }
                else 
                    console.error("Du lieu location khong hop le!");
                break;
            case 'up_button':
                let upButtonStatus = (payload=='true')?true:false;
                device.updateOne({name: deviceName}, {$set: {upButton: upButtonStatus, downButton: !upButtonStatus}}, (err, result)=>{
                    if (err)
                    {
                        console.log(err);
                        return err;
                    }
                    console.log("Up Button updated!");
                })
                break;
            case 'down_button':
                let downButtonStatus = (payload=='true')?true:false;
                device.updateOne({name: deviceName}, {$set: {downButton: downButtonStatus, upButton: !downButtonStatus}}, (err, result)=>{
                    if (err)
                    {
                        console.log(err);
                        return err;
                    }
                    console.log("DownButton updated!");
                })
                break;
            case 'alert':
                let alertStatus = (payload=='true')?true:false;
                device.updateOne({name: deviceName}, {$set: {alertButton: alertStatus}}, (err, result)=>{
                    if (err)
                    {
                        console.log(err);
                        return err;
                    }
                    console.log("Alert updated!");
                })
                break;
            default: 
                console.error(topic + ": Topic khong khop!");
        }
        console.log("Updated:")
        console.log(existDevice);
        return existDevice;
    }
    @Mutation(()=>Device)
    async motorUp(@Arg("id") id: number) {
        const existDevice = await this.db.collection("devices").findOne({ _id: id});
        if (!existDevice){
                console.error("Khong tim thay thiet bi!");
                return {}
            }
        // publish mqtt mesage
        let publishTopic = MQTT_BRAND + "/" + existDevice.name + "/device/up_button" 
        mqttClient.publish(publishTopic, "true", {qos: 2}, (err)=>{
            if (err){
                console.error("Error Publishing:");
                console.error(err);
            }  
            else
                console.log("Message Published!");
        })
        
        const device = this.db.collection("devices");
        device.updateOne({ _id: id},{$set: {upButton: true, downButton: false}}, (err, result)=>{
            if (err)
            {
                console.log(err);
                return err;
            }
            console.log("Mortor Up!");
        })
        return existDevice;
    }
    @Mutation(()=>Device)
    async motorDown(@Arg("id") id: number) {
        const existDevice = await this.db.collection("devices").findOne({ _id: id});
        if (!existDevice){
                console.error("Khong tim thay thiet bi!");
                return {}
            }
        // publish mqtt mesage
        let publishTopic = MQTT_BRAND + "/" + existDevice.name + "/device/down_button" 
        mqttClient.publish(publishTopic, "true", {qos: 2}, (err)=>{
            if (err){
                console.error("Error Publishing:");
                console.error(err);
            }  
            else
                console.log("Message Published!");
        })

        const device = this.db.collection("devices");
        device.updateOne({ _id: id},{$set: {downButton: true, upButton: false}}, (err, result)=>{
            if (err)
            {
                console.log(err);
                return err;
            }
            console.log("Mortor Down!");
        })
        return existDevice;
    }
    @Mutation(()=>Device)
    async sendAlert(@Arg("id") id: string){
        const existDevice = await this.db.collection("devices").findOne({ _id: id});
        if (!existDevice){
                console.error("Khong tim thay thiet bi!");
                return {}
            }
        // publish mqtt mesage
        let publishTopic = MQTT_BRAND + "/" + existDevice.name + "/device/alert" 
        mqttClient.publish(publishTopic, "true", {qos: 2}, (err)=>{
            if (err){
                console.error("Error Publishing:");
                console.error(err);
            }  
            else
                console.log("Message Published!");
        })

        const device = this.db.collection("devices");
        device.updateOne({ _id: id},{$set: {alertButton: true}}, (err, result)=>{
            if (err)
            {
                console.log(err);
                return err;
            }
            console.log("Alert sent!");
        })
        return existDevice;
    }
    @Query(() => [Device])
    async getDevices() {
        const result = this.db.collection("devices").find();
        return await result.toArray();
    }
}