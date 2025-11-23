import { Sale } from "src/domain/sale/sale.aggregate";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

export interface ISaleRepository {
  save(sale: Sale): Promise<void>;
  findById(id: Uuid): Promise<{
    id: string;
    sellerId: string;
    operatorId: string;
    catalogId: string;
    operationId: string;
    totalAmountInCents: number;
    items: {
      catalogItemId: string;
      quantity: number;
      priceAmountInCents: number;
      priceSuffix: string;
    }[];
  } | null>;
}
