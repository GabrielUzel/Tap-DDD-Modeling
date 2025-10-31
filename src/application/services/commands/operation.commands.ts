import { Injectable, Inject } from "@nestjs/common";
import type { IOperationRepository } from "src/application/repositories/interfaces/operation-repository.interface";
import type { ISellerRepository } from "src/application/repositories/interfaces/seller-repository.interface";
import { StartOperationDomainService } from "src/domain/services/start-operation.service";
import type {
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
} from "../../dtos/operation-dtos";
import { Operation } from "src/domain/operation/operation.aggregate";
import { Catalog } from "src/domain/seller/catalog.entity";
import { CatalogItem } from "src/domain/seller/catalog-item.entity";
import { CatalogType } from "src/domain/@shared/value-objects/catalog-type.value";
import { Money } from "src/domain/@shared/value-objects/money.value";
import { MoneySufix } from "src/domain/@shared/value-objects/money.value";
import { Role } from "src/domain/@shared/value-objects/role.value";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

@Injectable()
export class OperationCommands {
  private readonly startOperationDomainService: StartOperationDomainService;

  constructor(
    @Inject("OperationRepository")
    private readonly operationRepository: IOperationRepository,
    @Inject("SellerRepository")
    private readonly sellerRepository: ISellerRepository,
  ) {
    this.startOperationDomainService = new StartOperationDomainService();
  }

  public async createOperation(
    input: CreateOperationInput,
  ): Promise<CreateOperationOutput> {
    const operation = Operation.create(Uuid.generate(), input.name);
    await this.operationRepository.save(operation);

    return {
      operationId: operation.getId().getValue(),
    };
  }

  public async addSeller(input: AddSellerInput): Promise<AddSellerOutput> {
    const operationId = new Uuid(input.operationId);
    const sellerId = new Uuid(input.sellerId);

    const operation = await this.operationRepository.findById(operationId);
    if (!operation) {
      throw new Error("Operation not found");
    }

    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw new Error("Seller not found");
    }

    operation.addSeller(sellerId);
    await this.operationRepository.save(operation);

    return {
      operationId: operationId.getValue(),
      sellerId: sellerId.getValue(),
    };
  }

  public async addCatalog(input: AddCatalogInput): Promise<AddCatalogOutput> {
    const sellerId = new Uuid(input.sellerId);
    const operationId = new Uuid(input.operationId);

    const operation = await this.operationRepository.findById(operationId);
    if (!operation) {
      throw new Error("Operation not found");
    }

    if (!operation.hasSeller(sellerId)) {
      throw new Error("Seller does not belong to this operation");
    }

    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw new Error("Seller not found");
    }

    const catalog = Catalog.create(
      Uuid.generate(),
      input.catalogName,
      CatalogType.fromString(input.catalogType),
    );

    seller.addCatalog(catalog);
    await this.sellerRepository.save(seller);

    return {
      operationId: operationId.getValue(),
      sellerId: sellerId.getValue(),
      catalogId: catalog.getId().getValue(),
    };
  }

  public async addCatalogItem(
    input: AddCatalogItemInput,
  ): Promise<AddCatalogItemOutput> {
    const catalogId = new Uuid(input.catalogId);
    const operationId = new Uuid(input.operationId);
    const sellerId = new Uuid(input.sellerId);

    const operation = await this.operationRepository.findById(operationId);
    if (!operation) {
      throw new Error("Operation not found");
    }

    if (!operation.hasSeller(sellerId)) {
      throw new Error("Seller does not belong to this operation");
    }

    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw new Error("Seller not found");
    }

    const item = CatalogItem.create(
      Uuid.generate(),
      input.itemName,
      Money.create(input.itemPriceAmount, input.itemPriceSufix as MoneySufix),
    );

    seller.addItemToCatalog(catalogId, item);
    await this.sellerRepository.save(seller);

    return {
      operationId: operationId.getValue(),
      sellerId: sellerId.getValue(),
      catalogId: catalogId.getValue(),
      itemId: item.getId().getValue(),
    };
  }

  public async addAssignment(
    input: AddAssignmentInput,
  ): Promise<AddAssignmentOutput> {
    const operationId = new Uuid(input.operationId);
    const operation = await this.operationRepository.findById(operationId);

    if (!operation) {
      throw new Error("Operation not found");
    }

    const sellerId = new Uuid(input.sellerId);
    if (!operation.hasSeller(sellerId)) {
      throw new Error("Seller does not belong to this operation");
    }

    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw new Error("Seller not found");
    }

    const operatorId = new Uuid(input.operatorId);
    const catalogId = new Uuid(input.catalogId);
    const role = Role.fromString(input.role);

    seller.assignOperator(operatorId, catalogId, role);
    await this.sellerRepository.save(seller);

    return {
      operationId: operation.getId().getValue(),
      sellerId: sellerId.getValue(),
      operatorId: operatorId.getValue(),
      catalogId: catalogId.getValue(),
      role: role.getValue(),
    };
  }

  public async startOperation(
    input: StartOperationInput,
  ): Promise<StartOperationOutput> {
    const operationId = new Uuid(input.operationId);
    const operation = await this.operationRepository.findById(operationId);

    if (!operation) {
      throw new Error("Operation not found");
    }

    const sellers = await this.sellerRepository.findMany(operation.sellerIds);

    this.startOperationDomainService.validateOperationCanStart(sellers);

    operation.startOperation();
    await this.operationRepository.save(operation);

    return {
      operationId: operation.getId().getValue(),
    };
  }
}
