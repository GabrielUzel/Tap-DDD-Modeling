import { OperationRepository } from "../repositories/operation.repository";
import { SellerRepository } from "../repositories/seller.repository";
import { OperatorRepository } from "../repositories/operator.repository";
import { SaleRepository } from "../repositories/sale.repository";
import { Uuid } from "../../utils/uuid";
import { Operation } from "../../domain/aggregates/operation.aggregate";
import { Catalog } from "../../domain/entities/catalog.entity";
import { CatalogType } from "../../domain/value-objects/catalog-type.value";
import type { CatalogTypeOptions } from "../../domain/value-objects/catalog-type.value";
import { CatalogItem } from "../../domain/entities/catalog-item.entity";
import { Money } from "../../domain/value-objects/money.value";
import type { MoneySufix } from "../../domain/value-objects/money.value";
import { Role } from "../../domain/value-objects/role.value";
import type { RoleType } from "../../domain/value-objects/role.value";
import { StartOperationDomainService } from "../../domain/services/start-operation.domain-service";
import { RegisterSaleDomainService } from "../../domain/services/register-sale.domain-service";
import type {
  CreateOperationInput,
  CreateOperationOutput,
} from "../dtos/operation/create-operation.dto";
import type {
  AddSellerInput,
  AddSellerOutput,
} from "../dtos/operation/add-seller.dto";
import type {
  AddOperatorInput,
  AddOperatorOutput,
} from "../dtos/operation/add-operator.dto";
import type {
  AddCatalogInput,
  AddCatalogOutput,
} from "../dtos/operation/add-catalog.dto";
import type {
  AddCatalogItemInput,
  AddCatalogItemOutput,
} from "../dtos/operation/add-catalog-item.dto";
import type {
  AddAssignmentInput,
  AddAssignmentOutput,
} from "../dtos/operation/add-assignment.dto";
import type { StartOperationInput } from "../dtos/operation/start-operation.dto";

export class OperationService {
  private operationRepository: OperationRepository;
  private sellerRepository: SellerRepository;
  private operatorRepository: OperatorRepository;
  private saleRepository: SaleRepository;
  private startOperationService: StartOperationDomainService;
  private registerSaleService: RegisterSaleDomainService;

  constructor(
    operationRepository: OperationRepository,
    sellerRepository: SellerRepository,
    operatorRepository: OperatorRepository,
    saleRepository: SaleRepository,
  ) {
    this.operationRepository = operationRepository;
    this.sellerRepository = sellerRepository;
    this.operatorRepository = operatorRepository;
    this.saleRepository = saleRepository;
    this.startOperationService = new StartOperationDomainService();
    this.registerSaleService = new RegisterSaleDomainService();
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

    // Valida se seller existe
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

    const operator = await this.operatorRepository.findById(operatorId);
    if (!operator) {
      throw new Error("Operator not found");
    }

    // Aggregate valida e adiciona
    seller.addOperatorToPool(operator.getId());
    await this.sellerRepository.save(seller);

    return {
      operationId: operation.getId().getValue(),
      sellerId: sellerId.getValue(),
      operatorId: operator.getId().getValue(),
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
      input.catalog.name,
      new CatalogType(input.catalog.type as CatalogTypeOptions),
    );

    // Aggregate valida e adiciona
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
      input.item.name,
      Money.create(
        input.item.price.amount,
        input.item.price.sufix as MoneySufix,
      ),
    );

    // Aggregate valida e adiciona
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

    const operatorId = new Uuid(input.assignment.operatorId);
    const catalogId = new Uuid(input.assignment.catalogId);
    const role = new Role(input.assignment.role as RoleType);

    // Aggregate valida e cria assignment
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

    // Carrega todos os sellers da operação
    const sellers = await this.sellerRepository.findByIds(
      operation.getSellerIds(),
    );

    // Domain Service valida se pode iniciar
    this.startOperationService.validateOperationCanStart(sellers);

    // Aggregate muda o estado
    operation.startOperation();
    await this.operationRepository.save(operation);
  }

  public async registerSale(
    input: RegisterSaleInput,
  ): Promise<RegisterSaleOutput> {
    const operationId = new Uuid(input.operationId);
    const sellerId = new Uuid(input.sellerId);
    const operatorId = new Uuid(input.operatorId);
    const catalogId = new Uuid(input.catalogId);

    const operation = await this.operationRepository.findById(operationId);
    if (!operation) {
      throw new Error("Operation not found");
    }

    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw new Error("Seller not found");
    }

    // Domain Service valida se pode registrar venda
    this.registerSaleService.validateCanRegisterSale(
      seller,
      operatorId,
      catalogId,
    );

    // Operation cria a Sale
    const items = input.items.map((item) =>
      SaleItem.create(
        new Uuid(item.catalogItemId),
        item.quantity,
        Money.create(item.unitPrice.amount, item.unitPrice.sufix as MoneySufix),
      ),
    );

    const sale = operation.registerSale(sellerId, operatorId, catalogId, items);

    await this.saleRepository.save(sale);

    return {
      saleId: sale.getId().getValue(),
      totalAmount: sale.getTotalAmount(),
    };
  }
}
