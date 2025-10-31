import { ValueObject } from "../interfaces/value-object.interface";
import { Money } from "./money.value";
import { Uuid } from "../interfaces/uuid";

export class SaleItem implements ValueObject<SaleItemProps> {
  constructor(
    private _catalogItemId: Uuid,
    private _quantity: number,
    private _salePrice: Money,
  ) {
    this._catalogItemId = _catalogItemId;
    this._quantity = _quantity;
    this._salePrice = _salePrice;
  }

  public static create(
    catalogItemId: Uuid,
    quantity: number,
    salePrice: Money,
  ): SaleItem {
    if (quantity < 1) {
      throw new Error("Quantity must be greater than one");
    }

    if (quantity > 100) {
      throw new Error("Quantity must be lower than one hundred");
    }

    return new SaleItem(catalogItemId, quantity, salePrice);
  }

  public getValue(): SaleItemProps {
    return {
      catalogItemId: this._catalogItemId,
      quantity: this._quantity,
      salePrice: this._salePrice,
    };
  }

  public getTotal(): number {
    return this._quantity * this._salePrice.getAmount();
  }

  public equals(other: this): boolean {
    return (
      this._catalogItemId.equals(other._catalogItemId) &&
      this._quantity === other._quantity &&
      this._salePrice.equals(other._salePrice)
    );
  }
}

interface SaleItemProps {
  catalogItemId: Uuid;
  quantity: number;
  salePrice: Money;
}
