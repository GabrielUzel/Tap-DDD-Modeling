import { AggregateRoot } from "../../utils/aggregate-root.abstract";
import { Uuid } from "../../utils/uuid";
import { Email } from "../value-objects/email.value";
import { Catalog } from "../entities/catalog.entity";
import { CatalogItem } from "../entities/catalog-item.entity";
import { Assignment } from "../value-objects/assignment.value";
import { Role } from "../value-objects/role.value";

export class Seller extends AggregateRoot {
  private name: string;
  private email: Email;
  private catalogs: Catalog[] = [];
  private operatorIds: Uuid[] = [];
  private assignments: Assignment[] = [];

  constructor(id: Uuid, name: string, email: Email) {
    super(id);
    this.name = name;
    this.email = email;
  }

  public static create(id: Uuid, name: string, email: Email): Seller {
    if (!name.trim()) {
      throw new Error("Name cannot be empty");
    }

    if (name.length > 100) {
      throw new Error("Name is too long");
    }

    return new Seller(id, name, email);
  }

  public addCatalog(catalog: Catalog): void {
    if (this.hasCatalog(catalog.getId())) {
      throw new Error("Catalog already belongs to this seller");
    }

    this.catalogs.push(catalog);
  }

  public hasCatalog(catalogId: Uuid): boolean {
    return this.catalogs.some((catalog) => catalog.getId().equals(catalogId));
  }

  public getCatalog(catalogId: Uuid): Catalog {
    const catalog = this.catalogs.find((catalog) =>
      catalog.getId().equals(catalogId),
    );

    if (!catalog) {
      throw new Error("Catalog not found");
    }

    return catalog;
  }

  public addItemToCatalog(catalogId: Uuid, item: CatalogItem): void {
    const catalog = this.getCatalog(catalogId);
    catalog.addItem(item);
  }

  public hasCatalogWithItems(): boolean {
    return this.catalogs.some((catalog) => catalog.hasAnyItem());
  }

  public addOperatorToPool(operatorId: Uuid): void {
    if (this.operatorIsInPool(operatorId)) {
      throw new Error("Operator already in pool");
    }

    this.operatorIds.push(operatorId);
  }

  public operatorIsInPool(operatorId: Uuid): boolean {
    return this.operatorIds.some((id) => id.equals(operatorId));
  }

  public assignOperator(operatorId: Uuid, catalogId: Uuid, role: Role): void {
    if (!this.operatorIsInPool(operatorId)) {
      throw new Error("Operator is not in the pool");
    }

    if (!this.hasCatalog(catalogId)) {
      throw new Error("Catalog does not belong to this seller");
    }

    if (this.isOperatorAlreadyAssigned(operatorId, catalogId)) {
      throw new Error("Operator already assigned to this catalog");
    }

    this.assignments.push(Assignment.create(operatorId, catalogId, role));
  }

  public isOperatorAlreadyAssigned(operatorId: Uuid, catalogId: Uuid): boolean {
    return this.assignments.some((assignment) => {
      return (
        assignment.getOperatorId().equals(operatorId) &&
        assignment.getCatalogId().equals(catalogId)
      );
    });
  }

  public getAssignment(operatorId: Uuid, catalogId: Uuid): Assignment | null {
    return (
      this.assignments.find((assignment) => {
        return (
          assignment.getOperatorId().equals(operatorId) &&
          assignment.getCatalogId().equals(catalogId)
        );
      }) ?? null
    );
  }

  public canRegisterSale(operatorId: Uuid, catalogId: Uuid): boolean {
    if (!this.hasCatalog(catalogId)) {
      return false;
    }

    if (!this.operatorIsInPool(operatorId)) {
      return false;
    }

    const assignment = this.getAssignment(operatorId, catalogId);
    if (!assignment) {
      return false;
    }

    if (!assignment.operatorCanRegisterSale()) {
      return false;
    }

    return true;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): Email {
    return this.email;
  }

  public getCatalogs(): Catalog[] {
    return this.catalogs;
  }
}
