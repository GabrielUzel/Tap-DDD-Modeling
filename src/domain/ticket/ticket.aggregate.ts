import { AggregateRoot } from "../@shared/interfaces/aggregate-root.abstract";
import { Uuid } from "../@shared/interfaces/uuid";
import { SaleItem } from "../@shared/value-objects/sale-item.value";
import { TicketStatus } from "../@shared/value-objects/ticket-status.value";

export class Ticket extends AggregateRoot {
  constructor(
    id: Uuid,
    private _sellerId: Uuid,
    private _operatorId: Uuid,
    private _catalogId: Uuid,
    private _operationId: Uuid,
    private _items: SaleItem[],
    private _totalAmountInCents: number,
    private _status: TicketStatus,
    private _paidAt: Date | null,
  ) {
    super(id);
  }

  static create(
    id: Uuid,
    sellerId: Uuid,
    operatorId: Uuid,
    catalogId: Uuid,
    operationId: Uuid,
    items: SaleItem[],
  ): Ticket {
    if (!items || items.length === 0) {
      throw new Error("Ticket must contain at least one item");
    }

    const total = items.reduce((sum, item) => sum + item.getTotal(), 0);

    return new Ticket(
      id,
      sellerId,
      operatorId,
      catalogId,
      operationId,
      items,
      total,
      TicketStatus.OPEN,
      null,
    );
  }

  markAsPaid(paidAt: Date = new Date()): void {
    if (!this._status.isOpen()) {
      throw new Error("Only open tickets can be marked as paid");
    }

    this._status = TicketStatus.PAID;
    this._paidAt = paidAt;
  }

  cancel(): void {
    if (!this._status.isOpen()) {
      throw new Error("Only open tickets can be cancelled");
    }

    this._status = TicketStatus.CANCELLED;
  }

  static fromJSON(json: any): Ticket {
    const id = new Uuid(json.id);
    const sellerId = new Uuid(json.sellerId);
    const operatorId = new Uuid(json.operatorId);
    const catalogId = new Uuid(json.catalogId);
    const operationId = new Uuid(json.operationId);
    const items = (json.items ?? []).map((item: any) =>
      SaleItem.fromJSON(item),
    );
    const totalAmountInCents = json.totalAmountInCents;
    const status = TicketStatus.fromString(json.status);
    const paidAt = json.paidAt ? new Date(json.paidAt) : null;

    return new Ticket(
      id,
      sellerId,
      operatorId,
      catalogId,
      operationId,
      items,
      totalAmountInCents,
      status,
      paidAt,
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

  get status(): TicketStatus {
    return this._status;
  }

  get paidAt(): Date | null {
    return this._paidAt;
  }
}
