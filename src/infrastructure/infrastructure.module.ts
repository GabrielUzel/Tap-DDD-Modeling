import { Module } from "@nestjs/common";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { OperationRepository } from "./repositories/operation.repository";
import { SaleRepository } from "./repositories/sale.repository";
import { SellerRepository } from "./repositories/seller.repository";

@Module({
  providers: [
    PrismaService,
    {
      provide: "OperationRepository",
      useClass: OperationRepository,
    },
    {
      provide: "SaleRepository",
      useClass: SaleRepository,
    },
    {
      provide: "SellerRepository",
      useClass: SellerRepository,
    },
  ],
  exports: [
    PrismaService,
    "OperationRepository",
    "SaleRepository",
    "SellerRepository",
  ],
})
export class InfrastructureModule {}
