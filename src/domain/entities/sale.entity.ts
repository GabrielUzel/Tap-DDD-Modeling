import { Uuid } from "../../shared/uuid";
import { Entity } from "../../shared/entity.abstract";
import { SaleItem } from "../value-objects/sale-item.value";

export class Sale extends Entity {
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
