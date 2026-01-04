import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { QueryBus } from "@nestjs/cqrs";
import { GetSaleByIdQuery } from "src/application/queries/dtos/get-sale-by-id.query";
import { GetSaleByTicketIdQuery } from "src/application/queries/dtos/get-sale-by-ticket-id.query";
import { GetSalesByOperationIdQuery } from "src/application/queries/dtos/get-sales-by-operation-id.query";

import {
  GetSaleByIdInput,
  GetSaleByIdOutput,
  GetSaleByTicketIdInput,
  GetSaleByTicketIdOutput,
  GetSalesByOperationIdInput,
  GetSalesByOperationIdOutput,
} from "../types/sale.types";

@Resolver()
export class SaleResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @Query(() => GetSaleByIdOutput)
  async getSale(
    @Args("input") input: GetSaleByIdInput,
  ): Promise<GetSaleByIdOutput> {
    return this.queryBus.execute(new GetSaleByIdQuery(input.saleId));
  }

  @Query(() => [GetSalesByOperationIdOutput])
  async getSalesByOperationId(
    @Args("input") input: GetSalesByOperationIdInput,
  ): Promise<GetSalesByOperationIdOutput[]> {
    return this.queryBus.execute(
      new GetSalesByOperationIdQuery(input.operationId),
    );
  }

  @Query(() => GetSaleByTicketIdOutput, { nullable: true })
  async getSaleByTicketId(
    @Args("input") input: GetSaleByTicketIdInput,
  ): Promise<GetSaleByTicketIdOutput | null> {
    return this.queryBus.execute(new GetSaleByTicketIdQuery(input.ticketId));
  }
}
