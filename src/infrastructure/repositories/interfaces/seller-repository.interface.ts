import { Seller } from "src/domain/seller/seller.aggregate";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

export interface ISellerRepository {
  save(seller: Seller): Promise<void>;
  findById(id: Uuid): Promise<{
    id: string;
    name: string;
    email: string;
    operators: {
      id: string;
      name: string;
      email: string;
    }[];
    catalogs: {
      id: string;
      name: string;
      type: string;
      items: {
        id: string;
        name: string;
        priceAmountInCents: number;
        priceSuffix: string;
      }[];
    }[];
    assignments: {
      operatorId: string;
      catalogId: string;
      role: string;
    }[];
  } | null>;
  findMany(ids: string[]): Promise<
    {
      id: string;
      name: string;
      email: string;
      operators: {
        id: string;
        name: string;
        email: string;
      }[];
      catalogs: {
        id: string;
        name: string;
        type: string;
        items: {
          id: string;
          name: string;
          priceAmountInCents: number;
          priceSuffix: string;
        }[];
      }[];
      assignments: {
        operatorId: string;
        catalogId: string;
        role: string;
      }[];
    }[]
  >;
}
