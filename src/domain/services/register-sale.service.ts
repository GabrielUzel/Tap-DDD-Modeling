import { Seller } from "../aggregates/seller.aggregate";
import { Uuid } from "../../utils/uuid";

export class RegisterSaleDomainService {
  validateCanRegisterSale(
    seller: Seller,
    operatorId: Uuid,
    catalogId: Uuid,
  ): void {
    if (!seller.canRegisterSale(operatorId, catalogId)) {
      throw new Error(
        "Cannot register sale with provided operator and catalog",
      );
    }
  }
}
