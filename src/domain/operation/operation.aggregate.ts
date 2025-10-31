import { AggregateRoot } from "../@shared/interfaces/aggregate-root.abstract";
import { Sale } from "../sale/sale.aggregate";
import { Status } from "../@shared/value-objects/status.value";
import { SaleItem } from "../@shared/value-objects/sale-item.value";
import { Uuid } from "../@shared/interfaces/uuid";

export class Operation extends AggregateRoot {
  constructor(
    id: Uuid,
    private _name: string,
    private _status: Status,
    private _sellerIds: Uuid[],
  ) {
    super(id);
    this._name = _name;
    this._status = _status;
    this._sellerIds = _sellerIds;
  }

  public static create(id: Uuid, name: string): Operation {
    if (!name.trim()) {
      throw new Error("Name cannot be empty");
    }

    return new Operation(id, name, Status.PLANNED, []);
  }

  public addSeller(sellerId: Uuid): void {
    if (this._sellerIds.some((id) => id.equals(sellerId))) {
      throw new Error("Seller already added to the operation");
    }

    this._sellerIds.push(sellerId);
  }

  public startOperation(): void {
    if (!this._status.isPlanned()) {
      throw new Error("Only planned operations can be started");
    }

    this._status = Status.ON_GOING;
  }

  public registerSale(
    sellerId: Uuid,
    operatorId: Uuid,
    catalogId: Uuid,
    items: SaleItem[],
  ): Sale {
    if (!this._status.isOnGoing()) {
      throw new Error("Operation must be on_going to register a sale");
    }

    if (!this.hasSeller(sellerId)) {
      throw new Error("Seller does not belong to this operation");
    }

    const saleId = Uuid.generate();
    const sale = Sale.create(
      saleId,
      sellerId,
      operatorId,
      catalogId,
      this.getId(),
      items,
    );

    return sale;
  }

  public hasSeller(sellerId: Uuid): boolean {
    return this._sellerIds.some((id) => id.equals(sellerId));
  }

  get name(): string {
    return this._name;
  }

  get status(): Status {
    return this._status;
  }

  get sellerIds(): Uuid[] {
    return this._sellerIds;
  }
}
