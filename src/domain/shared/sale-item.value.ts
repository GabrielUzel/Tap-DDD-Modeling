import type { Uuid } from "../../shared/uuid";
import { ValueObject } from "../../shared/value-object.abstract";
import type { Money } from "./money.value";

interface SaleItemProps {
  catalogItemId: Uuid
  quantity: number
  salePrice: Money
}

export class SaleItem extends ValueObject<SaleItemProps> {
  constructor(props: SaleItemProps) {
    super(props);
  }

  public static create(catalogItemId: Uuid, quantity: number, salePrice: Money): SaleItem {
    if(quantity < 1) {
      throw new Error("Quantity must be greater than one");
    }

    if(quantity > 100) {
      throw new Error("Quantity must be lower than one hundred");
    }

    return new SaleItem({ catalogItemId, quantity, salePrice });
  }
}