import { Module } from "@nestjs/common";
import { OperationResolver } from "../resolvers/operation.resolver";
import { OperationQueries } from "src/application/services/queries/operation.queries";
import { OperationCommands } from "src/application/services/commands/operation.commands";
import { OperationRepository } from "src/application/repositories/operation.repository";
import { SellerRepository } from "src/application/repositories/seller.repository";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";

@Module({
  providers: [
    OperationResolver,
    OperationQueries,
    OperationCommands,
    PrismaService,
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
export class OperationModule {}
