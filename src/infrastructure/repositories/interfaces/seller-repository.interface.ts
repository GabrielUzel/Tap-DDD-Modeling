import { Seller } from "src/domain/seller/seller.aggregate";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

export interface ISellerRepository {
  save(seller: Seller): Promise<void>;
  findById(id: Uuid): Promise<Seller | null>;
  findMany(ids: Uuid[]): Promise<Seller[]>;
}
