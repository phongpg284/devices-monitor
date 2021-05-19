import { Collection, Db } from "mongodb";
import { DATABASE_INSTANCE_KEY } from "../config/index";
import { Arg, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import Container, { Service } from "typedi";

@ObjectType()
export class Device {
    @Field()
    name: string;

	@Field({ nullable: true })
    lat: number;

	@Field()
    lng: number;
    
    @Field()
    temperature: string;
    
    @Field()
    humidity!: string;
    
    @Field()
    rain!: boolean;

    @Field()
    dust!: string;
    
    @Field()
    coGas: string;
    
    @Field()
    soilHumid: string;
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
    temperature: string;
    
    @Field({ nullable: true })
    humidity: string;
    
    @Field({ nullable: true })
    rain: boolean;

    @Field({ nullable: true })
    dust: string;
    
    @Field({ nullable: true })
    coGas: string;
    
    @Field({ nullable: true })
    soilHumid: string;
}

@InputType()
class DeviceUpdateInput {
    @Field({ nullable: true })
    name: string;

	@Field({ nullable: true })
    lat: number;

	@Field({ nullable: true })
    lng: number;
    
    @Field({ nullable: true })
    temperature: string;
    
    @Field({ nullable: true })
    humidity: string;
    
    @Field({ nullable: true })
    rain: boolean;

    @Field({ nullable: true })
    dust: string;
    
    @Field({ nullable: true })
    coGas: string;
    
    @Field({ nullable: true })
    soilHumid: string;
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
        const result = await this.db.collection("devices").insertOne({
            ...inputs
        })
        return result.ops[0];
    }

    @Query(() => Device)
    async getDevice(@Arg("id") id: number) {
        const result = await this.db.collection("device").findOne({ _id: id});
        return result;
    }
}