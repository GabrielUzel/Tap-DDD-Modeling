import type { Uuid } from "../../utils/uuid";
import type { ValueObject } from "../../utils/value-object.interface";
import type { Money } from "../value-objects/money.value";

interface SaleItemProps {
  catalogItemId: Uuid;
  quantity: number;
  salePrice: Money;
}

export class SaleItem implements ValueObject<SaleItemProps> {
  private catalogItemId: Uuid;
  private quantity: number;
  private salePrice: Money;

  constructor(catalogItemId: Uuid, quantity: number, salePrice: Money) {
    this.catalogItemId = catalogItemId;
    this.quantity = quantity;
    this.salePrice = salePrice;
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
      catalogItemId: this.catalogItemId,
      quantity: this.quantity,
      salePrice: this.salePrice,
    };
  }

  public getTotal(): number {
    return this.quantity * this.salePrice.getAmount();
  }

  public equals(other: this): boolean {
    return (
      this.catalogItemId.equals(other.catalogItemId) &&
      this.quantity === other.quantity &&
      this.salePrice.equals(other.salePrice)
    );
  }
}
