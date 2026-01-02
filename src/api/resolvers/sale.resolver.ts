import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { QueryBus } from "@nestjs/cqrs";
import { GetSaleInput, GetSaleOutput } from "../types/sale.types";
import { GetSaleQuery } from "src/application/services/queries/dtos/get-sale.query";

@Resolver()
export class SaleResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @Query(() => GetSaleOutput)
  async getSale(@Args("input") input: GetSaleInput): Promise<GetSaleOutput> {
    return this.queryBus.execute(new GetSaleQuery(input.saleId));
  }
}
