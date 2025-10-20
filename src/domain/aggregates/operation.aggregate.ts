import { Uuid } from "../../utils/uuid";
import { Status } from "../value-objects/status.value";
import { AggregateRoot } from "../../utils/aggregate-root.abstract";
import { Sale } from "./sale.aggregate";
import { SaleItem } from "../value-objects/sale-item.value";

export class Operation extends AggregateRoot {
  private name: string;
  private status: Status;
  private sellerIds: Uuid[] = [];

  constructor(id: Uuid, name: string, status: Status) {
    super(id);
    this.name = name;
    this.status = status;
  }

  public static create(id: Uuid, name: string): Operation {
    if (!name.trim()) {
      throw new Error("Name cannot be empty");
    }

    return new Operation(id, name, new Status("planned"));
  }

  public addSeller(sellerId: Uuid): void {
    if (this.sellerIds.some((id) => id.equals(sellerId))) {
      throw new Error("Seller already added to the operation");
    }

    this.sellerIds.push(sellerId);
  }

  public startOperation(): void {
    if (!this.status.isPlanned()) {
      throw new Error("Only planned operations can be started");
    }

    this.status = new Status("on_going");
  }

  public registerSale(
    sellerId: Uuid,
    operatorId: Uuid,
    catalogId: Uuid,
    items: SaleItem[],
  ): Sale {
    if (!this.status.isOnGoing()) {
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
    return this.sellerIds.some((id) => id.equals(sellerId));
  }

  public getSellerIds(): Uuid[] {
    return this.sellerIds;
  }

  public getStatus(): string {
    return this.status.getValue();
  }

  public getName(): string {
    return this.name;
  }
}
