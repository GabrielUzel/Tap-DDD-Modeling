import { AggregateRoot } from "../@shared/interfaces/aggregate-root.abstract";
import { Operator } from "./operator.entity";
import { Catalog } from "./catalog.entity";
import { CatalogItem } from "./catalog-item.entity";
import { Email } from "../@shared/value-objects/email.value";
import { Assignment } from "../@shared/value-objects//assignment.value";
import { Role } from "../@shared/value-objects//role.value";
import { CatalogType } from "../@shared/value-objects/catalog-type.value";
import { Uuid } from "../@shared/interfaces/uuid";

export class Seller extends AggregateRoot {
  constructor(
    id: Uuid,
    private _name: string,
    private _email: Email,
    private _catalogs: Catalog[],
    private _operators: Operator[],
    private _assignments: Assignment[],
  ) {
    super(id);
  }

  static create(id: Uuid, name: string, email: Email): Seller {
    if (!name.trim()) {
      throw new Error("Name cannot be empty");
    }

    if (name.length > 100) {
      throw new Error("Name is too long");
    }

    return new Seller(id, name, email, [], [], []);
  }

  addCatalog(catalog: Catalog): void {
    if (this.hasCatalog(catalog.getId())) {
      throw new Error("Catalog already belongs to this seller");
    }

    this._catalogs.push(catalog);
  }

  hasCatalog(catalogId: Uuid): boolean {
    return this._catalogs.some((catalog) => catalog.getId().equals(catalogId));
  }

  getCatalog(catalogId: Uuid): Catalog {
    const catalog = this._catalogs.find((catalog) =>
      catalog.getId().equals(catalogId),
    );

    if (!catalog) {
      throw new Error("Catalog not found");
    }

    return catalog;
  }

  updateCatalog(
    catalogId: Uuid,
    name?: string,
    type?: string,
    catalogItems?: CatalogItem[],
  ): void {
    const catalog = this.getCatalog(catalogId);

    if (name !== undefined) {
      catalog.name = name;
    }

    if (type !== undefined) {
      catalog.type = CatalogType.fromString(type);
    }

    if (catalogItems !== undefined) {
      catalog.catalogItems = catalogItems;
    }
  }

  addItemToCatalog(catalogId: Uuid, item: CatalogItem): void {
    const catalog = this.getCatalog(catalogId);
    catalog.addItem(item);
  }

  removeItemFromCatalog(catalogId: Uuid, itemId: Uuid): void {
    const catalog = this.getCatalog(catalogId);
    catalog.removeItem(itemId);
  }

  hasCatalogWithItems(): boolean {
    return this._catalogs.some((catalog) => catalog.hasAnyItem());
  }

  addOperatorToPool(operator: Operator): void {
    if (this.operatorIsInPool(operator.getId())) {
      throw new Error("Operator already in pool");
    }

    this._operators.push(operator);
  }

  operatorIsInPool(operatorId: Uuid): boolean {
    return this._operators.some((operator) =>
      operator.getId().equals(operatorId),
    );
  }

  assignOperator(operatorId: Uuid, catalogId: Uuid, role: Role): void {
    if (!this.operatorIsInPool(operatorId)) {
      throw new Error("Operator is not in the pool");
    }

    if (!this.hasCatalog(catalogId)) {
      throw new Error("Catalog does not belong to this seller");
    }

    if (this.isOperatorAlreadyAssigned(operatorId, catalogId)) {
      throw new Error("Operator already assigned to this catalog");
    }

    this._assignments.push(Assignment.create(operatorId, catalogId, role));
  }

  isOperatorAlreadyAssigned(operatorId: Uuid, catalogId: Uuid): boolean {
    return this._assignments.some((assignment) => {
      return (
        assignment.operatorId.equals(operatorId) &&
        assignment.catalogId.equals(catalogId)
      );
    });
  }

  getAssignment(operatorId: Uuid, catalogId: Uuid): Assignment | null {
    return (
      this._assignments.find((assignment) => {
        return (
          assignment.operatorId.equals(operatorId) &&
          assignment.catalogId.equals(catalogId)
        );
      }) ?? null
    );
  }

  assertCanRegisterSale(operatorId: Uuid, catalogId: Uuid): void {
    if (!this.hasCatalog(catalogId)) {
      throw new Error("Catalog not found");
    }

    if (!this.operatorIsInPool(operatorId)) {
      throw new Error("Operator not in pool");
    }

    const assignment = this.getAssignment(operatorId, catalogId);

    if (!assignment) {
      throw new Error("Assignment not found");
    }

    if (!assignment.operatorCanRegisterSale()) {
      throw new Error("Operator cannot register sale");
    }
  }

  static fromJSON(json: any): Seller {
    const seller = new Seller(
      new Uuid(json.id),
      json.name,
      Email.create(json.email),
      [],
      [],
      [],
    );

    seller._catalogs = json.catalogs.map((catalog: any) =>
      Catalog.fromJSON(catalog),
    );

    seller._operators = json.operators.map((operator: any) =>
      Operator.fromJSON(operator),
    );

    seller._assignments = json.assignments.map((assignment: any) =>
      Assignment.fromJSON(assignment),
    );

    return seller;
  }

  get name(): string {
    return this._name;
  }

  get email(): Email {
    return this._email;
  }

  get catalogs(): Catalog[] {
    return this._catalogs;
  }

  get operators(): Operator[] {
    return this._operators;
  }

  get assignments(): Assignment[] {
    return this._assignments;
  }
}
