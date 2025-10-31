import { Module } from "@nestjs/common";
import { SaleResolver } from "../resolvers/sale.resolver";
import { SaleQueries } from "src/application/services/queries/sale.queries";
import { SaleCommands } from "src/application/services/commands/sale.commands";
import { SaleRepository } from "src/application/repositories/sale.repository";
import { OperationRepository } from "src/application/repositories/operation.repository";
import { SellerRepository } from "src/application/repositories/seller.repository";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";

@Module({
  providers: [
    SaleResolver,
    SaleQueries,
    SaleCommands,
    PrismaService,
    {
      provide: "SaleRepository",
      useClass: SaleRepository,
    },
    {
      provide: "OperationRepository",
      useClass: OperationRepository,
    },
    {
      provide: "SellerRepository",
      useClass: SellerRepository,
    },
  ],
})
export class SaleModule {}
