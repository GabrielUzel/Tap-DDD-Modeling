import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import {
  RegisterSaleInput,
  RegisterSaleOutput,
  GetSaleInput,
  GetSaleOutput,
} from "../types/sale.types";
import { RegisterSaleCommand } from "src/application/services/commands/dtos/register-sale.command";
import { GetSaleQuery } from "src/application/services/queries/dtos/get-sale.query";

@Resolver()
export class SaleResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Mutation(() => RegisterSaleOutput)
  async registerSale(
    @Args("input") input: RegisterSaleInput,
  ): Promise<RegisterSaleOutput> {
    return this.commandBus.execute(
      new RegisterSaleCommand(
        input.sellerId,
        input.operationId,
        input.operatorId,
        input.catalogId,
        input.items,
      ),
    );
  }

  @Query(() => GetSaleOutput)
  async getSale(@Args("input") input: GetSaleInput): Promise<GetSaleOutput> {
    return this.queryBus.execute(new GetSaleQuery(input.saleId));
  }
}
