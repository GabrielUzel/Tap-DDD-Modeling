import { Entity } from "../@shared/interfaces/entity.abstract";
import { CatalogType } from "../@shared/value-objects/catalog-type.value";
import { CatalogItem } from "./catalog-item.entity";
import { Uuid } from "../@shared/interfaces/uuid";

export class Catalog extends Entity {
  constructor(
    id: Uuid,
    private _name: string,
    private _type: CatalogType,
    private _catalogItems: CatalogItem[],
  ) {
    super(id);
    this._name = _name;
    this._type = _type;
    this._catalogItems = _catalogItems;
  }

  public static create(id: Uuid, name: string, type: CatalogType): Catalog {
    if (!name.trim()) {
      throw new Error("Name cannot be empty");
    }

    return new Catalog(id, name, type, []);
  }

  public addItem(catalogItem: CatalogItem) {
    this._catalogItems.push(catalogItem);
  }

  public removeItem(itemId: Uuid): void {
    const index = this._catalogItems.findIndex((item) =>
      item.getId().equals(itemId),
    );

    if (index === -1) {
      throw new Error("Item not found");
    }

    this._catalogItems.splice(index, 1);
  }

  public hasAnyItem(): boolean {
    return this._catalogItems.length > 0;
  }

  public findItem(itemId: Uuid): CatalogItem {
    const item = this._catalogItems.find((item) => item.id.equals(itemId));

    if (!item) {
      throw new Error("Item not found");
    }

    return item;
  }

  public static fromJSON(json: {
    id: string;
    name: string;
    type: string;
    catalogItems: any[];
  }): Catalog {
    const catalog = new Catalog(
      new Uuid(json.id),
      json.name,
      CatalogType.fromString(json.type),
      [],
    );

    catalog._catalogItems = json.catalogItems.map((item: any) =>
      CatalogItem.fromJSON(item),
    );

    return catalog;
  }

  get name(): string {
    return this._name;
  }

  get type(): CatalogType {
    return this._type;
  }

  get catalogItems(): CatalogItem[] {
    return this._catalogItems;
  }

  set name(name: string) {
    if (!name.trim()) {
      throw new Error("Name cannot be empty");
    }

    this._name = name;
  }

  set type(type: CatalogType) {
    this._type = type;
  }

  set catalogItems(catalogItems: CatalogItem[]) {
    this._catalogItems = catalogItems;
  }
}
