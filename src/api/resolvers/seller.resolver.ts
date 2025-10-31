import { Resolver, Mutation, Query, Args } from "@nestjs/graphql";
import { SellerQueries } from "src/application/services/queries/seller.queries";
import { SellerCommands } from "src/application/services/commands/seller.commands";
import {
  CreateSellerInput,
  CreateSellerOutput,
  AddOperatorToSellerPoolInput,
  AddOperatorToSellerPoolOutput,
  GetSellerInput,
  GetSellerOutput,
  SellerHasOperatorInput,
  SellerHasOperatorOutput,
  GetOperatorsInput,
  GetOperatorsOutput,
  GetCatalogInput,
  GetCatalogOutput,
  UpdateCatalogInput,
  UpdateCatalogOutput,
} from "../types/seller.types";

@Resolver()
export class SellerResolver {
  constructor(
    private readonly sellerQueries: SellerQueries,
    private readonly sellerCommands: SellerCommands,
  ) {}

  @Mutation(() => CreateSellerOutput)
  async createSeller(
    @Args("input") input: CreateSellerInput,
  ): Promise<CreateSellerOutput> {
    return await this.sellerCommands.createSeller(input);
  }

  @Mutation(() => AddOperatorToSellerPoolOutput)
  async addOperatorToSellerPool(
    @Args("input") input: AddOperatorToSellerPoolInput,
  ): Promise<AddOperatorToSellerPoolOutput> {
    return await this.sellerCommands.addOperatorToSellerPool(input);
  }

  @Mutation(() => UpdateCatalogOutput)
  async updateCatalog(
    @Args("input") input: UpdateCatalogInput,
  ): Promise<UpdateCatalogOutput> {
    return await this.sellerCommands.updateCatalog(input);
  }

  @Query(() => GetSellerOutput)
  async getSeller(
    @Args("input") input: GetSellerInput,
  ): Promise<GetSellerOutput> {
    return await this.sellerQueries.getSeller(input);
  }

  @Query(() => SellerHasOperatorOutput)
  async sellerHasOperator(
    @Args("input") input: SellerHasOperatorInput,
  ): Promise<SellerHasOperatorOutput> {
    return await this.sellerQueries.sellerHasOperator(input);
  }

  @Query(() => GetOperatorsOutput)
  async getOperators(
    @Args("input") input: GetOperatorsInput,
  ): Promise<GetOperatorsOutput> {
    return await this.sellerQueries.getOperators(input);
  }

  @Query(() => GetCatalogOutput)
  async getCatalog(
    @Args("input") input: GetCatalogInput,
  ): Promise<GetCatalogOutput> {
    return await this.sellerQueries.getCatalog(input);
  }
}
