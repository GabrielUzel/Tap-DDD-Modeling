import { Module } from "@nestjs/common";
import { SellerResolver } from "../resolvers/seller.resolver";
import { ApplicationModule } from "src/application/application.module";

@Module({
  imports: [ApplicationModule],
  providers: [SellerResolver],
})
export class SellerModule {}
