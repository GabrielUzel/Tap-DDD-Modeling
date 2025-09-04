export interface AddCatalogInput {
  operationId: string;
  sellerId: string;
  catalog: {
    name: string;
    type: string;
  };
}

export interface AddCatalogOutput {
  operationId: string;
  sellerId: string;
  catalogId: string;
}