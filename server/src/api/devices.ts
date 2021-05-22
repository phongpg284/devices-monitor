import { Collection, Db, ObjectId } from "mongodb";
import { DATABASE_INSTANCE_KEY } from "../config/index";
import { Arg, Field, ID, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import Container, { Service } from "typedi";

@ObjectType()
export class Device {
    @Field(() => ID)
    _id: string;

    @Field({ nullable: true })
    name: string;

	@Field({ nullable: true })
    lat: number;

	@Field({ nullable: true })
    lng: number;
    
    @Field({ nullable: true })
    temperature: number;
    
    @Field({ nullable: true })
    humidity!: number;
    
    @Field({ nullable: true })
    rain: boolean;

    @Field({ nullable: true })
    dust: number;
    
    @Field({ nullable: true })
    coGas: number;
    
    @Field({ nullable: true })
    soilHumid: number;

    @Field({ nullable: true })
    lastUpdated: Date;
} 


@InputType()
class DeviceCreateInput {
    @Field()
    name: string;

	@Field()
    lat: number;

	@Field()
    lng: number;
    
    @Field({ nullable: true })
    temperature: number;
    
    @Field({ nullable: true })
    humidity: number;
    
    @Field({ nullable: true })
    rain: boolean;

    @Field({ nullable: true })
    dust: number;
    
    @Field({ nullable: true })
    coGas: number;
    
    @Field({ nullable: true })
    soilHumid: number;
}

@InputType()
class DeviceUpdateInput {
    @Field(() => ID)
    _id: string;

    @Field({ nullable: true })
    name: string;

	@Field({ nullable: true })
    lat: number;

	@Field({ nullable: true })
    lng: number;
    
    @Field({ nullable: true })
    temperature: number;
    
    @Field({ nullable: true })
    humidity: number;
    
    @Field({ nullable: true })
    rain: boolean;

    @Field({ nullable: true })
    dust: number;
    
    @Field({ nullable: true })
    coGas: number;
    
    @Field({ nullable: true })
    soilHumid: number;
}

@Resolver()
@Service()
export class Devices {
    db: Db
    constructor() {
        this.db = (Container.get(DATABASE_INSTANCE_KEY) as any);
    }
    @Mutation(() => Device)
    async createDevice(@Arg("input") inputs: DeviceCreateInput) {
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
        return result;
    }

    @Query(() => [Device])
    async getDevices() {
        const result = this.db.collection("devices").find();
        return await result.toArray();
    }
    
}