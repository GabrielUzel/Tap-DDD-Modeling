import { Resolver, Mutation, Query, Args } from "@nestjs/graphql";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateSellerCommand } from "src/application/commands/dtos/create-seller.command";
import { AddOperatorToSellerPoolCommand } from "src/application/commands/dtos/add-operator-to-seller-pool.command";
import { UpdateCatalogCommand } from "src/application/commands/dtos/update-catalog.command";
import { RemoveCatalogItemFromCatalogCommand } from "src/application/commands/dtos/remove-catalog-item-from-catalog.command";
import { GetSellerByIdQuery } from "src/application/queries/dtos/get-seller-by-id.query";
import { SellerHasOperatorQuery } from "src/application/queries/dtos/seller-has-operator.query";
import { GetOperatorsQuery } from "src/application/queries/dtos/get-operators.query";
import { GetCatalogByIdQuery } from "src/application/queries/dtos/get-catalog-by-id.query";

import {
  CreateSellerInput,
  CreateSellerOutput,
  AddOperatorToSellerPoolInput,
  AddOperatorToSellerPoolOutput,
  UpdateCatalogInput,
  UpdateCatalogOutput,
  RemoveCatalogItemFromCatalogInput,
  RemoveCatalogItemFromCatalogOutput,
  GetSellerByIdInput,
  GetSellerByIdOutput,
  SellerHasOperatorInput,
  SellerHasOperatorOutput,
  GetOperatorsInput,
  GetOperatorsOutput,
  GetCatalogByIdInput,
  GetCatalogByIdOutput,
} from "../types/seller.types";

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

  @Query(() => GetSellerByIdOutput)
  async getSeller(
    @Args("input") input: GetSellerByIdInput,
  ): Promise<GetSellerByIdOutput> {
    return this.queryBus.execute(new GetSellerByIdQuery(input.sellerId));
  }

  @Query(() => SellerHasOperatorOutput)
  async sellerHasOperator(
    @Args("input") input: SellerHasOperatorInput,
  ): Promise<SellerHasOperatorOutput> {
    return this.queryBus.execute(
      new SellerHasOperatorQuery(input.sellerId, input.operatorId),
    );
  }

  @Query(() => [GetOperatorsOutput])
  async getOperators(
    @Args("input") input: GetOperatorsInput,
  ): Promise<GetOperatorsOutput[]> {
    return this.queryBus.execute(new GetOperatorsQuery(input.sellerId));
  }

  @Query(() => GetCatalogByIdOutput)
  async getCatalogById(
    @Args("input") input: GetCatalogByIdInput,
  ): Promise<GetCatalogByIdOutput> {
    return this.queryBus.execute(new GetCatalogByIdQuery(input.catalogId));
  }
}
