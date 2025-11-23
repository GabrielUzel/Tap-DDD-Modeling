import { Module } from "@nestjs/common";
import { SaleResolver } from "../resolvers/sale.resolver";
import { ApplicationModule } from "src/application/application.module";

@Module({
  imports: [ApplicationModule],
  providers: [SaleResolver],
})
export class SaleModule {}
