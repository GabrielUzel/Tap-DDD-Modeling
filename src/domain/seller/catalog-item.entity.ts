import { Entity } from "../@shared/interfaces/entity.abstract";
import { Money } from "../@shared/value-objects/money.value";
import { Uuid } from "../@shared/interfaces/uuid";

export class CatalogItem extends Entity {
  constructor(
    id: Uuid,
    private _name: string,
    private _price: Money,
  ) {
    super(id);
    this._name = _name;
    this._price = _price;
  }

  public static create(id: Uuid, name: string, price: Money): CatalogItem {
    if (!name.trim()) {
      throw new Error("Name cannot be empty");
    }

    return new CatalogItem(id, name, price);
  }

  get name() {
    return this._name;
  }

  get price() {
    return this._price;
  }
}
