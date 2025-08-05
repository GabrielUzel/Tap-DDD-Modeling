import { Entity } from "../../../shared/entity.abstract";
import type { Uuid } from "../../../shared/uuid";
import { Money } from "../../shared/money.value";

export class CatalogItem extends Entity {
  private name: string;
  private price: Money;

  constructor(id: Uuid, name: string, price: Money) {
    super(id);
    this.name = name;
    this.price = price;
  }

  public static create(id: Uuid, name: string, price: Money): CatalogItem {
    if(!name.trim()) {
      throw new Error("Name cannot be empty");
    }

    return new CatalogItem(id, name, price);
  }

  public getPrice() {
    return this.price;
  }
}