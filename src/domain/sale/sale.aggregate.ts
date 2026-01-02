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
    private _totalAmountInCents: number,
  ) {
    super(id);
    this._sellerId = _sellerId;
    this._operatorId = _operatorId;
    this._catalogId = _catalogId;
    this._operationId = _operationId;
    this._items = _items;
    this._totalAmountInCents = _totalAmountInCents;
  }

  static create(
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

  static fromJSON(json: any): Sale {
    const id = new Uuid(json.id);
    const sellerId = new Uuid(json.sellerId);
    const operatorId = new Uuid(json.operatorId);
    const catalogId = new Uuid(json.catalogId);
    const operationId = new Uuid(json.operationId);
    const items = json.items.map((item: any) => SaleItem.fromJSON(item));
    const totalAmountInCents = json.totalAmountInCents;

    return new Sale(
      id,
      sellerId,
      operatorId,
      catalogId,
      operationId,
      items,
      totalAmountInCents,
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

  get totalAmountInCents(): number {
    return this._totalAmountInCents;
  }
}
