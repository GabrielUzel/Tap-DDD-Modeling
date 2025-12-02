import { Seller } from "../seller/seller.aggregate";
import { Operation } from "../operation/operation.aggregate";

export class OperationDomainService {
  startOperation(operation: Operation, sellers: Seller[]): void {
    if (sellers.length === 0) {
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

    operation.startOperation();
  }
}
