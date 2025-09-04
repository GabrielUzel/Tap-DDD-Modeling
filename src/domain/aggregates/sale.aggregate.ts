import { Uuid } from "../../shared/uuid";
import { SaleItem } from "../value-objects/sale-item.value";
import { AggregateRoot } from "../../shared/aggregate-root.abstract";

export class Sale extends AggregateRoot {
  private sellerId: Uuid;
  private operatorId: Uuid;
  private catalogId: Uuid;
  private operationId: Uuid;
  private items: SaleItem[];
  private totalAmount: number;

  private constructor(
    id: Uuid,
    sellerId: Uuid,
    operatorId: Uuid,
    catalogId: Uuid,
    operationId: Uuid,
    items: SaleItem[],
    totalAmount: number
  ) {
    super(id);
    this.sellerId = sellerId;
    this.operatorId = operatorId;
    this.catalogId = catalogId;
    this.operationId = operationId;
    this.items = items;
    this.totalAmount = totalAmount;
  }

  public static create(
    id: Uuid,
    sellerId: Uuid,
    operatorId: Uuid,
    catalogId: Uuid,
    operationId: Uuid,
    items: SaleItem[]
  ): Sale {
    if (items.length === 0) {
      throw new Error("Sale must contain at least one item");
    }

    const total = items.reduce((sum, item) => sum + item.getTotal(), 0);
    return new Sale(id, sellerId, operatorId, catalogId, operationId, items, total);
  }

  public getTotalAmount(): number {
    return this.totalAmount;
  }
}
