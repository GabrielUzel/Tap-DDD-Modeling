import { Uuid } from "../../shared/uuid";
import { Status } from "../value-objects/status.value";
import { AggregateRoot } from "../../shared/aggregate-root.abstract";
import { Catalog } from "../entities/catalog.entity";
import { CatalogItem } from "../entities/catalog-item.entity";
import { OperationSeller } from "../entities/operation-seller.child-entity";
import { Role } from "../value-objects/role.value";
import { left, type Either } from "../../shared/either.protocol";

export class Operation extends AggregateRoot {
  private name: string;
  private status: Status;
  private sellers: OperationSeller[] = [];

  constructor(
    id: Uuid,
    name: string,
    status: Status
  ) {
    super(id);
    this.name = name;
    this.status = status;
  }

  public static create(
    id: Uuid,
    name: string
  ): Operation {
    if(!name.trim()) {
      throw new Error("Name cannot be empty");
    }

    const initialStatus: Status = new Status("planned");
    return new Operation(id, name, initialStatus);
  }

  public addSeller(sellerId: Uuid): void {
    const hasSeller = this.sellers.some(seller => seller.getSellerId().equals(sellerId));
    if (hasSeller) {
      throw new Error("Seller already added to the operation");
    }

    this.sellers.push(new OperationSeller(sellerId));
  }

  public startOperation(): void { 
    const hasAnyCatalog = this.sellers.some(seller => seller.hasAnyCatalog());
    if (!hasAnyCatalog) {
      throw new Error("No catalogs registered");
    }

    const hasValidCatalog = this.sellers.some(seller =>
      seller.getCatalogs().some(catalog => catalog.hasAnyItem())
    );

    if (!hasValidCatalog) {
      throw new Error("At least one catalog must contain items to start the operation");
    }

    this.status = new Status("on_going");
  }

  public canRegisterSale(sellerId: Uuid, operatorId: Uuid, catalogId: Uuid): Either<Error, true> {
    if(!this.status.isOnGoing()) {
      return left(new Error("Operation must be on_going to register a sale"));
    }

    const seller = this.sellers.find(seller => seller.getSellerId().equals(sellerId));
    if(!seller) {
      return left(new Error("Seller does not belong to this operation"));
    }

    return seller.canRegisterSale(operatorId, catalogId);
  }

  public findSeller(sellerId: Uuid): OperationSeller {
    const seller = this.sellers.find(seller => seller.getSellerId().equals(sellerId));

    if (!seller) {
      throw new Error("Seller not found");
    }

    return seller;
  } 

  public addCatalogToSeller(sellerId: Uuid, catalog: Catalog): void {
    const seller = this.findSeller(sellerId);
    seller.addCatalog(catalog);
  }

  public addItemToCatalogOfSeller(sellerId: Uuid, catalogId: Uuid, item: CatalogItem): void {
    const seller = this.findSeller(sellerId);
    seller.addItemToCatalog(catalogId, item);
  }
  public addOperatorToSeller(sellerId: Uuid, operatorId: Uuid): void {
    const seller = this.findSeller(sellerId);
    seller.addOperatorToPool(operatorId);
  }

  public addAssignmentToSeller(sellerId: Uuid, operatorId: Uuid, catalogId: Uuid, role: Role): void {
    const seller = this.findSeller(sellerId);
    seller.assignOperator(operatorId, catalogId, role);
  }

  public getStatus(): string {
    return this.status.getValue();
  }
}
