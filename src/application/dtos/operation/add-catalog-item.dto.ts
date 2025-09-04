export interface AddCatalogItemInput {
  operationId: string;
  sellerId: string;
  catalogId: string;
  item: {
    name: string;
    price: {
      amount: number;
      sufix: string;
    };
  };
}

export interface AddCatalogItemOutput {
  operationId: string;
  sellerId: string;
  catalogId: string;
  itemId: string;
}