import { Uuid } from "../../utils/uuid";
import { Seller } from "../../domain/aggregates/seller.aggregate";
import { Catalog } from "../../domain/entities/catalog.entity";
import { Assignment } from "../../domain/value-objects/assignment.value";

export interface SellerRepository {
  save(seller: Seller): Promise<void>;
  findById(id: Uuid): Promise<Seller | null>;
  findMany(ids: Uuid[]): Promise<Seller[]>;
  findCatalogById(catalogId: Uuid): Promise<Catalog | null>;
  findAssignment(operatorId: Uuid, catalogId: Uuid): Promise<Assignment | null>;
  sellerHasCatalogWithItems(sellerId: Uuid): Promise<boolean>;
  catalogBelongsToSeller(catalogId: Uuid, sellerId: Uuid): Promise<boolean>;
}
