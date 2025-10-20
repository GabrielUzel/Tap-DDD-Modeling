import type { OperationRepository } from "../repositories/operation.repository";
import type { SellerRepository } from "../repositories/seller.repository";
import type { SaleRepository } from "../repositories/sale.repository";
import { StartOperationDomainService } from "../../domain/services/start-operation.service";
import { RegisterSaleDomainService } from "../../domain/services/register-sale.service";
import { Operation } from "../../domain/aggregates/operation.aggregate";
import { Catalog } from "../../domain/entities/catalog.entity";
import { CatalogItem } from "../../domain/entities/catalog-item.entity";
import { CatalogType } from "../../domain/value-objects/catalog-type.value";
import type { CatalogTypeOptions } from "../../domain/value-objects/catalog-type.value";
import { Money } from "../../domain/value-objects/money.value";
import type { MoneySufix } from "../../domain/value-objects/money.value";
import { Role } from "../../domain/value-objects/role.value";
import type { RoleType } from "../../domain/value-objects/role.value";
import type {
  CreateOperationInput,
  CreateOperationOutput,
  StartOperationInput,
  AddSellerInput,
  AddSellerOutput,
  AddOperatorInput,
  AddOperatorOutput,
  AddCatalogInput,
  AddCatalogOutput,
  AddCatalogItemInput,
  AddCatalogItemOutput,
  AddAssignmentInput,
  AddAssignmentOutput,
} from "../dtos/operation-dtos";
import { Uuid } from "../../utils/uuid";

export class OperationService {
  private operationRepository: OperationRepository;
  private sellerRepository: SellerRepository;
  private startOperationService: StartOperationDomainService;

  constructor(
    operationRepository: OperationRepository,
    sellerRepository: SellerRepository,
  ) {
    this.operationRepository = operationRepository;
    this.sellerRepository = sellerRepository;
    this.startOperationService = new StartOperationDomainService();
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

  public async addOperator(
    input: AddOperatorInput,
  ): Promise<AddOperatorOutput> {
    const operationId = new Uuid(input.operationId);
    const sellerId = new Uuid(input.sellerId);
    const operatorId = new Uuid(input.operatorId);

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

    seller.addOperatorToPool(operatorId);
    await this.sellerRepository.save(seller);

    return {
      operationId: operation.getId().getValue(),
      sellerId: sellerId.getValue(),
      operatorId: operatorId.getValue(),
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
      new CatalogType(input.catalogType as CatalogTypeOptions),
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
    const role = new Role(input.role as RoleType);

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

  public async startOperation(input: StartOperationInput): Promise<void> {
    const operationId = new Uuid(input.operationId);
    const operation = await this.operationRepository.findById(operationId);

    if (!operation) {
      throw new Error("Operation not found");
    }

    const sellers = await this.sellerRepository.findMany(
      operation.getSellerIds(),
    );

    this.startOperationService.validateOperationCanStart(sellers);

    operation.startOperation();
    await this.operationRepository.save(operation);
  }
}
