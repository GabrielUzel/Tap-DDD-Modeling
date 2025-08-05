import { Entity } from "../../../shared/entity.abstract";
import type { Uuid } from "../../../shared/uuid";
import type { CatalogType } from "../value-objects/catalog-type.value";
import type { CatalogItem } from "./catalog-item.entity";

export class Catalog extends Entity {
  private name: string;
  private type: CatalogType;
  private catalogItems: CatalogItem[] = [];

  constructor(id: Uuid, name: string, type: CatalogType) {
    super(id);
    this.name = name;
    this.type = type;
  }

  public static create(id: Uuid, name: string, type: CatalogType): Catalog {
    if(!name.trim()) {
      throw new Error("Name cannot be empty");
    }

    return new Catalog(id, name, type);
  }

  public addItem(catalogItem: CatalogItem) {
    this.catalogItems.push(catalogItem);
  }

  public hasAnyItem(): boolean {
    return this.catalogItems.length > 0;
  }
}