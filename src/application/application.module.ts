import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { InfrastructureModule } from "src/infrastructure/infrastructure.module";

import {
  AddOperatorToSellerPoolHandler,
  AddSellerToOperationHandler,
  CancelTicketHandler,
  CreateAssignmentHandler,
  CreateCatalogItemHandler,
  CreateCatalogHandler,
  CreateOperationHandler,
  CreateSellerHandler,
  CreateTicketHandler,
  MarkTicketAsPaidHandler,
  RegisterSaleHandler,
  RemoveCatalogItemFromCatalogHandler,
  StartOperationHandler,
  UpdateCatalogHandler,
} from "./commands/__index__";

import {
  GetCatalogByIdHandler,
  GetOperationByIdHandler,
  GetOperationsHandler,
  GetOperatorsHandler,
  GetSaleByIdHandler,
  GetSaleByTicketIdHandler,
  GetSalesByOperationIdHandler,
  GetSellerByIdHandler,
  GetSellersHandler,
  GetTicketByIdHandler,
  GetTicketsByOperationIdHandler,
  GetTicketsBySellerIdHandler,
  SellerHasOperatorHandler,
} from "./queries/__index__";

import { RegisterSaleOnTicketPaidHandler } from "./events/ticket-paid.handler";

const COMMAND_HANDLERS = [
  AddOperatorToSellerPoolHandler,
  AddSellerToOperationHandler,
  CancelTicketHandler,
  CreateAssignmentHandler,
  CreateCatalogItemHandler,
  CreateCatalogHandler,
  CreateOperationHandler,
  CreateSellerHandler,
  CreateTicketHandler,
  MarkTicketAsPaidHandler,
  RegisterSaleHandler,
  RemoveCatalogItemFromCatalogHandler,
  StartOperationHandler,
  UpdateCatalogHandler,
];

const QUERY_HANDLERS = [
  GetCatalogByIdHandler,
  GetOperationByIdHandler,
  GetOperationsHandler,
  GetOperatorsHandler,
  GetSaleByIdHandler,
  GetSaleByTicketIdHandler,
  GetSalesByOperationIdHandler,
  GetSellerByIdHandler,
  GetSellersHandler,
  GetTicketByIdHandler,
  GetTicketsByOperationIdHandler,
  GetTicketsBySellerIdHandler,
  SellerHasOperatorHandler,
];

const EVENT_HANDLERS = [RegisterSaleOnTicketPaidHandler];

@Module({
  imports: [CqrsModule, InfrastructureModule],
  providers: [...COMMAND_HANDLERS, ...QUERY_HANDLERS, ...EVENT_HANDLERS],
  exports: [CqrsModule],
})
export class ApplicationModule {}
