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
    if(quantity < 0) {
      throw new Error("Quantity must be greater than zero");
    }

    if(salePrice.getAmount() < 0) {
      throw new Error("salePrice must be greate than zero");
    }

    return new SaleItem({ catalogItemId, quantity, salePrice });
  }
}