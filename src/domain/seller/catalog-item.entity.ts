import { Entity } from "../@shared/interfaces/entity.abstract";
import { Money, MoneySufix } from "../@shared/value-objects/money.value";
import { Uuid } from "../@shared/interfaces/uuid";

export class CatalogItem extends Entity {
  constructor(
    id: Uuid,
    private _name: string,
    private _priceInCents: Money,
  ) {
    super(id);
  }

  static create(id: Uuid, name: string, price: Money): CatalogItem {
    if (!name.trim()) {
      throw new Error("Name cannot be empty");
    }

    return new CatalogItem(id, name, price);
  }

  static fromJSON(json: {
    id: string;
    name: string;
    priceInCents: number;
    priceCurrency: string;
  }): CatalogItem {
    const id = new Uuid(json.id);
    const name = json.name;
    const price = new Money(
      json.priceInCents,
      json.priceCurrency as MoneySufix,
    );

    return new CatalogItem(id, name, price);
  }

  get name() {
    return this._name;
  }

  get priceInCents() {
    return this._priceInCents;
  }
}
