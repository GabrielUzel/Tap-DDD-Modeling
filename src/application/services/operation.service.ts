import type { AddSellerInput, AddSellerOutput } from "../dtos/operation/add-seller.dto";
import type { AddOperatorInput, AddOperatorOutput } from "../dtos/operation/add-operator.dto";
import type { AddCatalogInput, AddCatalogOutput } from "../dtos/operation/add-catalog.dto";
import type { AddCatalogItemInput, AddCatalogItemOutput } from "../dtos/operation/add-catalog-item.dto";
import type { AddAssignmentInput, AddAssignmentOutput } from "../dtos/operation/add-assignment.dto";
import type { CreateOperationInput, CreateOperationOutput } from "../dtos/operation/create-operation.dto";
import type { StartOperationInput } from "../dtos/operation/start-operation.dto";
import { OperationRepository } from "../repositories/operation.repository";
import { OperatorRepository } from "../repositories/operator.repository";
import { CatalogRepository } from "../repositories/catalog.repository";
import { CatalogItemRepository } from "../repositories/catalog-item.repository";
import { Uuid } from "../../shared/uuid";
import { Operation } from "../../domain/aggregates/operation.aggregate";
import { Catalog } from "../../domain/entities/catalog.entity";
import { CatalogType } from "../../domain/value-objects/catalog-type.value";
import type { CatalogTypeOptions } from "../../domain/value-objects/catalog-type.value";
import { CatalogItem } from "../../domain/entities/catalog-item.entity";
import { Money } from "../../domain/value-objects/money.value";
import type { MoneySufix } from "../../domain/value-objects/money.value";
import { Role } from "../../domain/value-objects/role.value";
import type { RoleType } from "../../domain/value-objects/role.value";
import { isLeft, left, right, type Either } from "../../shared/either.protocol";

export class OperationService {
  private operationRepository: OperationRepository;
  private operatorRepository: OperatorRepository;
  private catalogRepository: CatalogRepository;
  private catalogItemRepository: CatalogItemRepository;

  constructor(
    operationRepository: OperationRepository,
    operatorRepository: OperatorRepository,
    catalogRepository: CatalogRepository,
    catalogItemRepository: CatalogItemRepository
  ) {
    this.operationRepository = operationRepository;
    this.operatorRepository = operatorRepository;
    this.catalogRepository = catalogRepository;
    this.catalogItemRepository = catalogItemRepository;
  }

  public async createOperation(
    input: CreateOperationInput
  ): Promise<Either<Error, CreateOperationOutput>> {
    try {
      const operation = Operation.create(Uuid.generate(), input.name);

      await this.operationRepository.save(operation);
    
      return right({
        operationId: operation.getId().getValue(),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return left(new Error(error.message));
      }

      return left(new Error("An unknown error occurred"));
    }
  }

  public async addSeller(
    input: AddSellerInput
  ): Promise<Either<Error, AddSellerOutput>> {
    try {
      const operationId = new Uuid(input.operationId);
      const sellerId = new Uuid(input.sellerId);
      
      const operationResult = await this.operationRepository.findById(operationId);
      if (isLeft(operationResult)) {
        return left(new Error("Operation not found"));
      }
      const operation = operationResult.right;
  
      operation.addSeller(sellerId);
  
      await this.operationRepository.save(operation); 
  
      return right({
        operationId: operationId.getValue(),
        sellerId: sellerId.getValue(),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return left(new Error(error.message));
      }
      
      return left(new Error("An unknown error occurred"));
    }
  }

  public async addOperator(
    input: AddOperatorInput
  ): Promise<Either<Error, AddOperatorOutput>> {
    try {
      const operationId = new Uuid(input.operationId);
      const sellerId = new Uuid(input.sellerId);
      const operatorId = new Uuid(input.operatorId);
  
      const operationResult = await this.operationRepository.findById(operationId);
      if (isLeft(operationResult)) {
        return left(new Error("Operation not found"));
      }
      const operation = operationResult.right;
      
      const operatorResult = await this.operatorRepository.findById(operatorId);
      if (isLeft(operatorResult)) {
        return left(new Error("Operator not found"));
      }
      const operator = operatorResult.right;
      
      operation.addOperatorToSeller(sellerId, operator.getId()); 
      await this.operationRepository.save(operation); 
  
      return right({
        operationId: operation.getId().getValue(),
        sellerId: sellerId.getValue(),
        operatorId: operator.getId().getValue(),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return left(new Error(error.message));
      }
      
      return left(new Error("An unknown error occurred"));
    }
  }

  public async addCatalog(
    input: AddCatalogInput
  ): Promise<Either<Error, AddCatalogOutput>> {
    try {
      const sellerId = new Uuid(input.sellerId);
      const operationId = new Uuid(input.operationId);

      const operationResult = await this.operationRepository.findById(operationId);
      if (isLeft(operationResult)) {
        return left(new Error("Operation not found"));
      }
      const operation = operationResult.right;

      const catalog = Catalog.create(Uuid.generate(), input.catalog.name, new CatalogType(input.catalog.type as CatalogTypeOptions));
      operation.addCatalogToSeller(sellerId, catalog);

      await this.catalogRepository.save(catalog);
      await this.operationRepository.save(operation);

      return right({
        operationId: operationId.getValue(),
        sellerId: sellerId.getValue(),
        catalogId: catalog.getId().getValue(),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return left(new Error(error.message));
      }
      
      return left(new Error("An unknown error occurred"));
    }
  }

  public async addCatalogItem(
    input: AddCatalogItemInput
  ): Promise<Either<Error, AddCatalogItemOutput>> {
    try {
      const catalogId = new Uuid(input.catalogId);
      const operationId = new Uuid(input.operationId);
      const sellerId = new Uuid(input.sellerId);

      const operationResult = await this.operationRepository.findById(operationId);
      if (isLeft(operationResult)) {
        return left(new Error("Operation not found"));
      }
      const operation = operationResult.right;

      const item = CatalogItem.create(Uuid.generate(), input.item.name, Money.create(input.item.price.amount, input.item.price.sufix as MoneySufix)); 
      operation.addItemToCatalogOfSeller(sellerId, catalogId, item);
      await this.catalogItemRepository.save(item);
      await this.operationRepository.save(operation);

      return right({
        operationId: operationId.getValue(),
        sellerId: sellerId.getValue(),
        catalogId: catalogId.getValue(),
        itemId: item.getId().getValue(),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return left(new Error(error.message));
      }

      return left(new Error("An unknown error occurred"));
    }
  }

  public async addAssignment(
    input: AddAssignmentInput
  ): Promise<Either<Error, AddAssignmentOutput>> {
    try {
      const operationId = new Uuid(input.operationId);
      const operationResult = await this.operationRepository.findById(operationId);

      if (isLeft(operationResult)) {
        return left(new Error("Operation not found"));
      }

      const operation = operationResult.right;
      const sellerId = new Uuid(input.sellerId);
      const operatorId = new Uuid(input.assignment.operatorId);
      const catalogId = new Uuid(input.assignment.catalogId);
      const role = new Role(input.assignment.role as RoleType);

      operation.addAssignmentToSeller(sellerId, operatorId, catalogId, role);
      await this.operationRepository.save(operation);

      return right({
        operationId: operation.getId().getValue(),
        sellerId: sellerId.getValue(),
        operatorId: operatorId.getValue(),
        catalogId: catalogId.getValue(),
        role: role.getValue(),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return left(new Error(error.message));
      }

      return left(new Error("An unknown error occurred"));
    }
  }

  public async startOperation(
    input: StartOperationInput
  ): Promise<Either<Error, void>> {
    try {
      const operationId = new Uuid(input.operationId);
      const operationResult = await this.operationRepository.findById(operationId);
  
      if (isLeft(operationResult)) {
        return left(new Error("Operation not found"));
      }
  
      const operation = operationResult.right;
      operation.startOperation();
      await this.operationRepository.save(operation);
  
      return right(undefined);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return left(new Error(error.message));
      }

      return left(new Error("An unknown error occurred"));
    }
  }
}

