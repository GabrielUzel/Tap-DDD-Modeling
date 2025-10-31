import { AggregateRoot } from "../@shared/interfaces/aggregate-root.abstract";
import { SaleItem } from "../@shared/value-objects/sale-item.value";
import { Uuid } from "../@shared/interfaces/uuid";

export class Sale extends AggregateRoot {
  constructor(
    id: Uuid,
    private _sellerId: Uuid,
    private _operatorId: Uuid,
    private _catalogId: Uuid,
    private _operationId: Uuid,
    private _items: SaleItem[],
    private _totalAmount: number,
  ) {
    super(id);
    this._sellerId = _sellerId;
    this._operatorId = _operatorId;
    this._catalogId = _catalogId;
    this._operationId = _operationId;
    this._items = _items;
    this._totalAmount = _totalAmount;
  }

  public static create(
    id: Uuid,
    sellerId: Uuid,
    operatorId: Uuid,
    catalogId: Uuid,
    operationId: Uuid,
    items: SaleItem[],
  ): Sale {
    if (items.length === 0) {
      throw new Error("Sale must contain at least one item");
    }

    const total = items.reduce((sum, item) => sum + item.getTotal(), 0);

    return new Sale(
      id,
      sellerId,
      operatorId,
      catalogId,
      operationId,
      items,
      total,
    );
  }

  get sellerId(): Uuid {
    return this._sellerId;
  }

  get operatorId(): Uuid {
    return this._operatorId;
  }

  get catalogId(): Uuid {
    return this._catalogId;
  }

  get operationId(): Uuid {
    return this._operationId;
  }

  get items(): SaleItem[] {
    return this._items;
  }

  get totalAmount(): number {
    return this._totalAmount;
  }
}
