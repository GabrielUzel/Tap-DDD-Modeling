import { Entity } from "../../shared/entity.abstract";
import type { Uuid } from "../../shared/uuid";

export class Catalog extends Entity {
  private name: string;
  private catalogItemsIds: Uuid[] = [];

  constructor(id: Uuid, name: string) {
    super(id);
    this.name = name;
  }

  public static create(id: Uuid, name: string): Catalog {
    if(!name.trim()) {
      throw new Error("Name cannot be empty");
    }

    return new Catalog(id, name);
  }

  public addItem(catalogItemId: Uuid) {
    this.catalogItemsIds.push(catalogItemId);
  }

  public hasAnyItem(): boolean {
    return this.catalogItemsIds.length > 0;
  }
}