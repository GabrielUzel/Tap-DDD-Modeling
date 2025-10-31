import { Sale } from "src/domain/sale/sale.aggregate";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

export interface ISaleRepository {
  save(sale: Sale): Promise<void>;
  findById(id: Uuid): Promise<Sale | null>;
}
