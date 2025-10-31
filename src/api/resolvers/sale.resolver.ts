import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { SaleQueries } from "src/application/services/queries/sale.queries";
import { SaleCommands } from "src/application/services/commands/sale.commands";
import {
  RegisterSaleInput,
  RegisterSaleOutput,
  GetSaleInput,
  GetSaleOutput,
} from "../types/sale.types";

@Resolver()
export class SaleResolver {
  constructor(
    private readonly saleQueries: SaleQueries,
    private readonly saleCommands: SaleCommands,
  ) {}

  @Mutation(() => RegisterSaleOutput)
  async registerSale(
    @Args("input") input: RegisterSaleInput,
  ): Promise<RegisterSaleOutput> {
    return await this.saleCommands.registerSale(input);
  }

  @Query(() => GetSaleOutput)
  async getSale(@Args("input") input: GetSaleInput): Promise<GetSaleOutput> {
    return await this.saleQueries.getSale(input);
  }
}
