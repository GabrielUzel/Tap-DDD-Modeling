import { AggregateRoot } from "../@shared/interfaces/aggregate-root.abstract";
import { Sale } from "../sale/sale.aggregate";
import { Seller } from "../seller/seller.aggregate";
import { OperationStatus } from "../@shared/value-objects/operation-status.value";
import { SaleItem } from "../@shared/value-objects/sale-item.value";
import { Uuid } from "../@shared/interfaces/uuid";

export class Operation extends AggregateRoot {
  constructor(
    id: Uuid,
    private _name: string,
    private _status: OperationStatus,
    private _sellerIds: Uuid[],
  ) {
    super(id);
  }

  static create(id: Uuid, name: string): Operation {
    if (!name.trim()) {
      throw new Error("Name cannot be empty");
    }

    return new Operation(id, name, OperationStatus.PLANNED, []);
  }

  addSeller(sellerId: Uuid): void {
    if (this._sellerIds.some((id) => id.equals(sellerId))) {
      throw new Error("Seller already added to the operation");
    }

    this._sellerIds.push(sellerId);
  }

  startOperation(sellers: Seller[]): void {
    if (!this._status.isPlanned()) {
      throw new Error("Only planned operations can be started");
    }

    if (!sellers || sellers.length === 0) {
      throw new Error("Operation must have at least one seller");
    }

    const hasValidSeller = sellers.some((seller) =>
      seller.hasCatalogWithItems(),
    );

    if (!hasValidSeller) {
      throw new Error(
        "Operation must have at least one seller with a catalog containing items",
      );
    }

    this._status = OperationStatus.ON_GOING;
  }

  registerSale(
    seller: Seller,
    operatorId: Uuid,
    catalogId: Uuid,
    items: SaleItem[],
    ticketId: Uuid,
  ): Sale {
    if (!this._status.isOnGoing()) {
      throw new Error("Operation must be on_going to register a sale");
    }

    if (!this.hasSeller(seller.getId())) {
      throw new Error("Seller does not belong to this operation");
    }

    seller.assertCanRegisterSale(operatorId, catalogId);

    return Sale.create(
      Uuid.generate(),
      seller.getId(),
      operatorId,
      catalogId,
      this.getId(),
      items,
      ticketId,
    );
  }

  hasSeller(sellerId: Uuid): boolean {
    return this._sellerIds.some((id) => id.equals(sellerId));
  }

  static fromJSON(json: {
    id: string;
    name: string;
    status: string;
    sellerIds: string[];
  }): Operation {
    const id = new Uuid(json.id);
    const name = json.name;
    const status = OperationStatus.fromString(json.status);
    const sellerIds = json.sellerIds.map((id) => new Uuid(id));

    return new Operation(id, name, status, sellerIds);
  }

  get name(): string {
    return this._name;
  }

  get status(): OperationStatus {
    return this._status;
  }

  get sellerIds(): Uuid[] {
    return this._sellerIds;
  }
}
