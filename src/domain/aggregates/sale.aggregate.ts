import { Uuid } from "../../shared/uuid";
import { SaleItem } from "../shared/sale-item.value";
import { AggregateRoot } from "../../shared/aggregate-root.abstract";

export class Sale extends AggregateRoot {
  private operatorId: Uuid;
  private catalogId: Uuid;
  private operationId: Uuid;
  private items: SaleItem[];

  private constructor(id: Uuid, operatorId: Uuid, catalogId: Uuid, operationId: Uuid, items: SaleItem[]) {
    super(id);
    this.operatorId = operatorId;
    this.catalogId = catalogId;
    this.operationId = operationId;
    this.items = items;
  }

  public static create(id: Uuid, operatorId: Uuid, catalogId: Uuid, operationId: Uuid, items: SaleItem[]): Sale {
    if (items.length === 0) {
      throw new Error("Sale must contain at least one item");
    }

    return new Sale(id, operatorId, catalogId, operationId, items);
  }
}
