import { Collection, Db, ObjectId } from "mongodb";
import { DATABASE_INSTANCE_KEY } from "../config/index";
import { Arg, Field, ID, InputType, Mutation, ObjectType, Query, Resolver, registerEnumType } from "type-graphql";
import Container, { Service } from "typedi";
import { callbackify } from "util";
import { mqttClient } from "../mqtt"
import {MQTT_BRAND, MQTT_BROKER} from "../config";
import { CylinderStatus } from "./BorderDevices";

@InputType("environmentFeedingUnitInput")
@ObjectType()
class EnvironmentFeedingUnit{
    @Field(()=>[Number])
    data?: number[];
    @Field(()=>Number, {nullable:true})
    threshold?: number;
    @Field(()=>[Date])
    updateTime?: Date[]
}
// export enum CylinderStatus{
//     UP = 'up',
//     DOWN = 'down',
//     STOP = 'stop'
// }
// registerEnumType(CylinderStatus, {
//     name: "CylinderStatus",
// })
@ObjectType()
export class FeedingDevice  {
    @Field(() => ID)
    _id: string;

    @Field({ nullable: true })
    name: string;
    
    @Field(() => EnvironmentFeedingUnit)
    temperature: EnvironmentFeedingUnit;
    
	@Field(() => EnvironmentFeedingUnit)
    pH: EnvironmentFeedingUnit;

    @Field(() => EnvironmentFeedingUnit)
    o2Gas: EnvironmentFeedingUnit;

    @Field(() => Number)
    footCan: number;
    
    @Field(()=>Number)
    footTray: number;

    @Field(()=>Number)
    fan: number

    @Field(()=>CylinderStatus)
    cylinder: CylinderStatus;
}

@InputType()
class FeedingDeviceCreateInput{
    @Field({ nullable: true })
    name: string;
    
    @Field(() => EnvironmentFeedingUnit)
    temperature: EnvironmentFeedingUnit;
    
	@Field(()=> EnvironmentFeedingUnit)
    pH: EnvironmentFeedingUnit;

    @Field(() => EnvironmentFeedingUnit)
    o2Gas: EnvironmentFeedingUnit;

    @Field(()=>Number, {nullable: true})
    footCan?: number;
    
    @Field(()=>Number, {nullable: true})
    footTray?: number;

    @Field(()=>Number, {nullable: true})
    fan?: number

    @Field(()=>CylinderStatus, { nullable: true })
    cylinder: CylinderStatus;
}

@Resolver()
export class FeedingDevices{
    db: Db
    constructor() {
        this.db = (Container.get(DATABASE_INSTANCE_KEY) as any);
    }
    @Query(() => FeedingDevice)
    async getFeedingDevice(@Arg("id") id: string) {
        const result = await this.db.collection("FeedingDevices").findOne({ _id: id});
        console.log(result);
        return result;
    }
    @Query(() => [FeedingDevice])
    async getFeedingDevices() {
        const result = this.db.collection("FeedingDevices").find();
        return await result.toArray();
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

    @Mutation(()=> FeedingDevice)
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
                        threshold: 1000,
                        data: [],
                        updateTime: [],
                    }, 
                    pH: {
                        threshold: 1000,
                        data: [],
                        updateTime: [],
                    },
                    o2Gas: {
                        threshold: 1000,
                        data: [],
                        updateTime: [],
                    },
                    footCan: 0,
                    footTray: 0,
                    cylinder: CylinderStatus.STOP,
                    fan: 0
                });
        console.log("Current status:")
        console.log(existDevice);
        const device = this.db.collection("FeedingDevices");
        switch (topic){
            case 'temperature':
                device.updateOne(
                    {name: FeedingDeviceName}, 
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
                    MQTT_BRAND + "/thap_cho_ca/" + existDevice.name + "/environment/pH/$threshold/set", 
                        temperatureThreshold, 
                        {qos: 2},
                        ()=>{
                            console.log(">>>>>>>>>>> pH threshold sent!");
                        });
                break;
            case 'o2_gas':
                device.updateOne(
                    {name: FeedingDeviceName}, 
                    {$push: {"o2Gas.data": parseFloat(payload), "o2Gas.updateTime" : new Date()}}, 
                    (err, result)=>{
                        if (err)
                        {
                            console.log(err);
                            return err;
                        }
                        console.log("o2Gas updated!");
                    })
                let o2GasThreshold = "true";
                if (parseFloat(payload)>existDevice.o2Gas.threshold)
                    o2GasThreshold = "false";
                mqttClient.publish(
                    MQTT_BRAND + "/thap_cho_ca/" + existDevice.name + "/environment/o2_gas/threshold", 
                    o2GasThreshold, 
                    {qos: 2});
                break;
            case 'pH':
                device.updateOne(
                    {name: FeedingDeviceName}, 
                    {$push: {"pH.data": parseFloat(payload), "pH.updateTime" : new Date()}}, 
                    (err, result)=>{
                        if (err)
                        {
                            console.log(err);
                            return err;
                        }
                        console.log("pH updated!");
                    })
                let pHThreshold = "true";
                if (parseFloat(payload)>existDevice.pH.threshold)
                    pHThreshold = "false";
                mqttClient.publish(
                    MQTT_BRAND + "/thap_cho_ca/" + existDevice.name + "/environment/pH/threshold", 
                    pHThreshold, 
                    {qos: 2});
                break;
            case 'foot_can':
                device.updateOne({name: FeedingDeviceName}, {$set: {footCan: parseFloat(payload)}}, (err, result)=>{
                        if (err)
                        {
                            console.log(err);
                            return err;
                            
                        }
                        console.log("foot_can updated!");
                    })
                break;
            case 'foot_tray':
                device.updateOne(
                    {name: FeedingDeviceName}, {$set: {footTray: parseFloat(payload)}}, (err, result)=>{
                        if (err)
                        {
                            console.log(err);
                            return err;
                            
                        }
                        console.log("foot_tray updated!");
                    })
                break;
            case 'fan':
                device.updateOne({name: FeedingDeviceName}, {$set: {fan: parseFloat(payload)}}, (err, result)=>{
                        if (err)
                        {
                            console.log(err);
                            return err;
                            
                        }
                        console.log("fan updated!");
                    })
                break;
            case 'cylinder':
                if ((<any>Object).values(CylinderStatus).includes(payload))
                    device.updateOne({name: FeedingDeviceName}, {$set: {cylinder: payload}}, (err, result)=>{
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
            case 'threshold':
                break;
            default: 
                console.error(topic + ": Topic khong khop!");
        }
        console.log("Updated:")
        console.log(existDevice);
        return existDevice;
    }
    @Mutation(()=>FeedingDevice)
    async setFeedingThreshold(@Arg("id") id: string, @Arg("property") property: string, @Arg("value") value: number){
        const existDevice = await this.db.collection("FeedingDevices").findOne({ _id: id});
        if (!existDevice){
                console.error("Khong tim thay thiet bi!");
                return {}
            }
        const device = this.db.collection("FeedingDevices");
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
            case 'o2Gas':
                device.updateOne( {_id: id}, {$set: {"o2Gas.threshold": value}}, (err, result)=>{
                    if (err)
                    {
                        console.log(err);
                        return err;
                        
                    }
                    console.log("o2Gas threshold updated!");
                })
                break;
            case 'pH':
                device.updateOne( {_id: id}, {$set: {"pH.threshold": value}}, (err, result)=>{
                    if (err)
                    {
                        console.log(err);
                        return err;
                    }
                    console.log("ph threshold updated!");
                })
                break;
        }
        return existDevice;
    }
    @Mutation(()=>FeedingDevice)
    async setFootCan(@Arg("id") id: string, @Arg("value") value: number){
        const existDevice = await this.db.collection("FeedingDevices").findOne({ _id: id});
        if (!existDevice){
                console.error("Khong tim thay thiet bi!");
                return {}
            }
        // publish mqtt mesage
        let publishTopic = MQTT_BRAND + "/thap_cho_ca/" + existDevice.name + "/device/foot_can" 
        mqttClient.publish(publishTopic, value.toString(), {qos: 2});

        const device = this.db.collection("FeedingDevices");
        device.updateOne({ _id: id},{$set: {footCan: value}}, (err, result)=>{
            if (err)
            {
                console.log(err);
                return err;
            }
            console.log("footCan set!");
        })
        return existDevice;
    }
    @Mutation(()=>FeedingDevice)
    async setFootTray(@Arg("id") id: string, @Arg("value") value: number){
        const existDevice = await this.db.collection("FeedingDevices").findOne({ _id: id});
        if (!existDevice){
                console.error("Khong tim thay thiet bi!");
                return {}
            }
        // publish mqtt mesage
        let publishTopic = MQTT_BRAND + "/thap_cho_ca/" + existDevice.name + "/device/foot_tray" 
        mqttClient.publish(publishTopic, value.toString(), {qos: 2});

        const device = this.db.collection("FeedingDevices");
        device.updateOne({ _id: id},{$set: {footTray: value}}, (err, result)=>{
            if (err)
            {
                console.log(err);
                return err;
            }
            console.log("footTray set!");
        })
        return existDevice;
    }
    @Mutation(()=>FeedingDevice)
    async setFan(@Arg("id") id: string, @Arg("value") value: number){
        const existDevice = await this.db.collection("FeedingDevices").findOne({ _id: id});
        if (!existDevice){
                console.error("Khong tim thay thiet bi!");
                return {}
            }
        // publish mqtt mesage
        let publishTopic = MQTT_BRAND + "/thap_cho_ca/" + existDevice.name + "/device/fan" 
        mqttClient.publish(publishTopic, value.toString(), {qos: 2});

        const device = this.db.collection("FeedingDevices");
        device.updateOne({ _id: id},{$set: {fan: value}}, (err, result)=>{
            if (err)
            {
                console.log(err);
                return err;
            }
            console.log("fan set!");
        })
        return existDevice;
    }
    @Mutation(()=>FeedingDevice)
    async updateFeedingCylinderStatus(@Arg("id") id: string, @Arg("status") status: CylinderStatus) {
        const existDevice = await this.db.collection("FeedingDevices").findOne({ _id: id});
        if (!existDevice){
                console.error("Khong tim thay thiet bi!");
                return {}
            }
        // publish mqtt mesage
        let publishTopic = MQTT_BRAND + "/thap_cho_ca/" + existDevice.name + "/device/cylinder" 
        mqttClient.publish(publishTopic, status, {qos: 2});
        
        const device = this.db.collection("FeedingDevices");
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
}