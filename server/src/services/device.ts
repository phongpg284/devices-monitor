// import { DATABASE_INSTANCE_KEY } from "src/config";
// import { Container, Service } from "typedi";

// @Service()
// export class DeviceService {
//     constructor() {
//         (Container.get(DATABASE_INSTANCE_KEY) as any).collection('devices');
//     }
//     @Query(() => Device)
//     async getDevice(@Arg("id") id: number) {
//         const result = await this.collection.findOne({ _id: id});
//         return result;
//     }

// }