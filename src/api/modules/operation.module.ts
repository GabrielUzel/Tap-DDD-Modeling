import { Module } from "@nestjs/common";
import { OperationResolver } from "../resolvers/operation.resolver";
import { ApplicationModule } from "src/application/application.module";

@Module({
  imports: [ApplicationModule],
  providers: [OperationResolver],
})
export class OperationModule {}
