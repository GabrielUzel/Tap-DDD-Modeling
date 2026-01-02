import { Module } from "@nestjs/common";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { OperationRepository } from "./repositories/operation.repository";
import { SaleRepository } from "./repositories/sale.repository";
import { SellerRepository } from "./repositories/seller.repository";
import { TicketRepository } from "./repositories/ticket.repository";

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
    {
      provide: "TicketRepository",
      useClass: TicketRepository,
    },
  ],
  exports: [
    PrismaService,
    "OperationRepository",
    "SaleRepository",
    "SellerRepository",
    "TicketRepository",
  ],
})
export class InfrastructureModule {}
