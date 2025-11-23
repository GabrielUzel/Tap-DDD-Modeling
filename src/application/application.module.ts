import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { InfrastructureModule } from "src/infrastructure/infrastructure.module";

import {
  CreateAssignmentHandler,
  CreateCatalogItemHandler,
  CreateCatalogHandler,
  AddOperatorToSellerPoolHandler,
  AddSellerToOperationHandler,
  CreateOperationHandler,
  CreateSellerHandler,
  RegisterSaleHandler,
  StartOperationHandler,
  UpdateCatalogHandler,
  RemoveCatalogItemFromCatalogHandler,
} from "./services/commands/__index__";

import {
  GetCatalogHandler,
  GetOperationByIdHandler,
  GetOperationsHandler,
  GetOperatorsHandler,
  GetSaleHandler,
  GetSellerHandler,
  GetSellersHandler,
  SellerHasOperatorHandler,
} from "./services/queries/__index__";

const COMMAND_HANDLERS = [
  CreateAssignmentHandler,
  CreateCatalogItemHandler,
  CreateCatalogHandler,
  AddOperatorToSellerPoolHandler,
  AddSellerToOperationHandler,
  CreateOperationHandler,
  CreateSellerHandler,
  RegisterSaleHandler,
  StartOperationHandler,
  UpdateCatalogHandler,
  RemoveCatalogItemFromCatalogHandler,
];

const QUERY_HANDLERS = [
  GetCatalogHandler,
  GetOperationByIdHandler,
  GetOperationsHandler,
  GetOperatorsHandler,
  GetSaleHandler,
  GetSellerHandler,
  GetSellersHandler,
  SellerHasOperatorHandler,
];

@Module({
  imports: [CqrsModule, InfrastructureModule],
  providers: [...COMMAND_HANDLERS, ...QUERY_HANDLERS],
  exports: [CqrsModule],
})
export class ApplicationModule {}
