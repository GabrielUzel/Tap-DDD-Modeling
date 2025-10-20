import { Uuid } from "../../utils/uuid";
import { Sale } from "../../domain/aggregates/sale.aggregate";

export interface SaleRepository {
  save(sale: Sale): Promise<void>;
  findById(id: Uuid): Promise<Sale | null>;
}
