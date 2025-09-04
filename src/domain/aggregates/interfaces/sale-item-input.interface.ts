import { CatalogItem } from "../../entities/catalog-item.entity";

export interface SaleItemInput {
  item: CatalogItem;
  quantity: number;
}