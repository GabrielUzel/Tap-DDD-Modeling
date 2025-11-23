import { Resolver, Mutation, Query, Args } from "@nestjs/graphql";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
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
  AddCatalogItemToCatalogInput,
  AddCatalogItemToCatalogOutput,
  RemoveCatalogItemFromCatalogInput,
  RemoveCatalogItemFromCatalogOutput,
} from "../types/seller.types";
import { CreateSellerCommand } from "src/application/services/commands/dtos/create-seller.command";
import { AddOperatorToSellerPoolCommand } from "src/application/services/commands/dtos/add-operator-to-seller-pool.command";
import { UpdateCatalogCommand } from "src/application/services/commands/dtos/update-catalog.command";
import { RemoveCatalogItemFromCatalogCommand } from "src/application/services/commands/dtos/remove-catalog-item-from-catalog.command";
import { GetSellerQuery } from "src/application/services/queries/dtos/get-seller.query";
import { SellerHasOperatorQuery } from "src/application/services/queries/dtos/seller-has-operator.query";
import { GetOperatorsQuery } from "src/application/services/queries/dtos/get-operators.query";
import { GetCatalogQuery } from "src/application/services/queries/dtos/get-catalog.query";

@Resolver()
export class SellerResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Mutation(() => CreateSellerOutput)
  async createSeller(
    @Args("input") input: CreateSellerInput,
  ): Promise<CreateSellerOutput> {
    return this.commandBus.execute(
      new CreateSellerCommand(input.name, input.email),
    );
  }

  @Mutation(() => AddOperatorToSellerPoolOutput)
  async addOperatorToSellerPool(
    @Args("input") input: AddOperatorToSellerPoolInput,
  ): Promise<AddOperatorToSellerPoolOutput> {
    return this.commandBus.execute(
      new AddOperatorToSellerPoolCommand(
        input.sellerId,
        input.operatorName,
        input.operatorEmail,
      ),
    );
  }

  @Mutation(() => UpdateCatalogOutput)
  async updateCatalog(
    @Args("input") input: UpdateCatalogInput,
  ): Promise<UpdateCatalogOutput> {
    return this.commandBus.execute(
      new UpdateCatalogCommand(
        input.sellerId,
        input.catalogId,
        input.catalogName,
        input.catalogType,
      ),
    );
  }

  @Mutation(() => RemoveCatalogItemFromCatalogOutput)
  async removeCatalogItemFromCatalog(
    @Args("input") input: RemoveCatalogItemFromCatalogInput,
  ): Promise<RemoveCatalogItemFromCatalogOutput> {
    return this.commandBus.execute(
      new RemoveCatalogItemFromCatalogCommand(
        input.sellerId,
        input.catalogId,
        input.itemId,
      ),
    );
  }

  @Query(() => GetSellerOutput)
  async getSeller(
    @Args("input") input: GetSellerInput,
  ): Promise<GetSellerOutput> {
    return this.queryBus.execute(new GetSellerQuery(input.sellerId));
  }

  @Query(() => SellerHasOperatorOutput)
  async sellerHasOperator(
    @Args("input") input: SellerHasOperatorInput,
  ): Promise<SellerHasOperatorOutput> {
    return this.queryBus.execute(
      new SellerHasOperatorQuery(input.sellerId, input.operatorId),
    );
  }

  @Query(() => GetOperatorsOutput)
  async getOperators(
    @Args("input") input: GetOperatorsInput,
  ): Promise<GetOperatorsOutput> {
    return this.queryBus.execute(new GetOperatorsQuery(input.sellerId));
  }

  @Query(() => GetCatalogOutput)
  async getCatalog(
    @Args("input") input: GetCatalogInput,
  ): Promise<GetCatalogOutput> {
    return this.queryBus.execute(
      new GetCatalogQuery(input.sellerId, input.catalogId),
    );
  }
}
