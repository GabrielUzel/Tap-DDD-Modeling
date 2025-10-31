import { Module } from "@nestjs/common";
import { SellerResolver } from "../resolvers/seller.resolver";
import { SellerQueries } from "src/application/services/queries/seller.queries";
import { SellerCommands } from "src/application/services/commands/seller.commands";
import { SellerRepository } from "src/application/repositories/seller.repository";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";

@Module({
  providers: [
    SellerResolver,
    SellerQueries,
    SellerCommands,
    PrismaService,
    {
      provide: "SellerRepository",
      useClass: SellerRepository,
    },
  ],
})
export class SellerModule {}
