import { Mutation, Query, Resolver, Args } from "@nestjs/graphql";
import {
  CreateOperationInput,
  CreateOperationOutput,
  AddSellerInput,
  AddSellerOutput,
  AddCatalogInput,
  AddCatalogOutput,
  AddCatalogItemInput,
  AddCatalogItemOutput,
  AddAssignmentInput,
  AddAssignmentOutput,
  StartOperationInput,
  StartOperationOutput,
  GetOperationsOutput,
  GetOperationInput,
  GetOperationOutput,
  GetSellersInput,
  GetSellersOutput,
} from "../types/operation.types";
import { OperationQueries } from "src/application/services/queries/operation.queries";
import { OperationCommands } from "src/application/services/commands/operation.commands";

@Resolver()
export class OperationResolver {
  constructor(
    private readonly operationQueries: OperationQueries,
    private readonly operationCommands: OperationCommands,
  ) {}

  @Mutation(() => CreateOperationOutput)
  async createOperation(
    @Args("input") input: CreateOperationInput,
  ): Promise<CreateOperationOutput> {
    return await this.operationCommands.createOperation(input);
  }

  @Mutation(() => AddSellerOutput)
  async addSeller(
    @Args("input") input: AddSellerInput,
  ): Promise<AddSellerOutput> {
    return await this.operationCommands.addSeller(input);
  }

  @Mutation(() => AddCatalogOutput)
  async addCatalog(
    @Args("input") input: AddCatalogInput,
  ): Promise<AddCatalogOutput> {
    return await this.operationCommands.addCatalog(input);
  }

  @Mutation(() => AddCatalogItemOutput)
  async addCatalogItem(
    @Args("input") input: AddCatalogItemInput,
  ): Promise<AddCatalogItemOutput> {
    return await this.operationCommands.addCatalogItem(input);
  }

  @Mutation(() => AddAssignmentOutput)
  async addAssignment(
    @Args("input") input: AddAssignmentInput,
  ): Promise<AddAssignmentOutput> {
    return await this.operationCommands.addAssignment(input);
  }

  @Mutation(() => StartOperationOutput)
  async startOperation(
    @Args("input") input: StartOperationInput,
  ): Promise<StartOperationOutput> {
    return await this.operationCommands.startOperation(input);
  }

  @Query(() => GetOperationsOutput)
  async getOperations(): Promise<GetOperationsOutput> {
    return await this.operationQueries.getOperations();
  }

  @Query(() => GetOperationOutput)
  async getOperation(
    @Args("input") input: GetOperationInput,
  ): Promise<GetOperationOutput> {
    return await this.operationQueries.getOperation(input);
  }

  @Query(() => GetSellersOutput)
  async getSellers(
    @Args("input") input: GetSellersInput,
  ): Promise<GetSellersOutput> {
    return await this.operationQueries.getSellers(input);
  }
}
