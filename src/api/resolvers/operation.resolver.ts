import { Mutation, Query, Resolver, Args } from "@nestjs/graphql";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateOperationCommand } from "src/application/commands/dtos/create-operation.command";
import { AddSellerToOperationCommand } from "src/application/commands/dtos/add-seller-to-operation.command";
import { CreateCatalogCommand } from "src/application/commands/dtos/create-catalog.command";
import { CreateCatalogItemCommand } from "src/application/commands/dtos/create-catalog-item.command";
import { CreateAssignmentCommand } from "src/application/commands/dtos/create-assignment.command";
import { StartOperationCommand } from "src/application/commands/dtos/start-operation.command";
import { GetOperationsQuery } from "src/application/queries/dtos/get-operations.query";
import { GetOperationByIdQuery } from "src/application/queries/dtos/get-operation-by-id.query";
import { GetSellersQuery } from "src/application/queries/dtos/get-sellers.query";

import {
  CreateOperationInput,
  CreateOperationOutput,
  AddSellerToOperationInput,
  AddSellerToOperationOutput,
  CreateCatalogInput,
  CreateCatalogOutput,
  CreateCatalogItemInput,
  CreateCatalogItemOutput,
  CreateAssignmentInput,
  CreateAssignmentOutput,
  StartOperationInput,
  StartOperationOutput,
  GetOperationsOutput,
  GetOperationByIdInput,
  GetOperationByIdOutput,
  GetSellersInput,
  GetSellersOutput,
} from "../types/operation.types";

@Resolver()
export class OperationResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Mutation(() => CreateOperationOutput)
  async createOperation(
    @Args("input") input: CreateOperationInput,
  ): Promise<CreateOperationOutput> {
    return this.commandBus.execute(new CreateOperationCommand(input.name));
  }

  @Mutation(() => AddSellerToOperationOutput)
  async addSellerToOperation(
    @Args("input") input: AddSellerToOperationInput,
  ): Promise<AddSellerToOperationOutput> {
    return this.commandBus.execute(
      new AddSellerToOperationCommand(input.operationId, input.sellerId),
    );
  }

  @Mutation(() => CreateCatalogOutput)
  async createCatalog(
    @Args("input") input: CreateCatalogInput,
  ): Promise<CreateCatalogOutput> {
    return this.commandBus.execute(
      new CreateCatalogCommand(
        input.operationId,
        input.sellerId,
        input.catalogName,
        input.catalogType,
      ),
    );
  }

  @Mutation(() => CreateCatalogItemOutput)
  async createCatalogItem(
    @Args("input") input: CreateCatalogItemInput,
  ): Promise<CreateCatalogItemOutput> {
    return this.commandBus.execute(
      new CreateCatalogItemCommand(
        input.operationId,
        input.sellerId,
        input.catalogId,
        input.itemName,
        input.itemPriceAmount,
        input.itemPriceSufix,
      ),
    );
  }

  @Mutation(() => CreateAssignmentOutput)
  async createAssignment(
    @Args("input") input: CreateAssignmentInput,
  ): Promise<CreateAssignmentOutput> {
    return this.commandBus.execute(
      new CreateAssignmentCommand(
        input.operationId,
        input.sellerId,
        input.operatorId,
        input.catalogId,
        input.role,
      ),
    );
  }

  @Mutation(() => StartOperationOutput)
  async startOperation(
    @Args("input") input: StartOperationInput,
  ): Promise<StartOperationOutput> {
    return this.commandBus.execute(
      new StartOperationCommand(input.operationId),
    );
  }

  @Query(() => [GetOperationsOutput])
  async getOperations(): Promise<GetOperationsOutput[]> {
    return this.queryBus.execute(new GetOperationsQuery());
  }

  @Query(() => GetOperationByIdOutput)
  async getOperationById(
    @Args("input") input: GetOperationByIdInput,
  ): Promise<GetOperationByIdOutput> {
    return this.queryBus.execute(new GetOperationByIdQuery(input.operationId));
  }

  @Query(() => [GetSellersOutput])
  async getSellers(
    @Args("input") input: GetSellersInput,
  ): Promise<GetSellersOutput[]> {
    return this.queryBus.execute(new GetSellersQuery(input.operationId));
  }
}
