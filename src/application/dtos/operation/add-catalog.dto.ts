export interface AddCatalogInput {
  // catalogId?: string; // Pode ser assim
  operationId: string;
  sellerId: string;
  catalog: {
    name: string;
    type: string;
  };
  // catalogName: string;
  // catalogType: string;
}

export interface AddCatalogOutput {
  operationId: string;
  sellerId: string;
  catalogId: string;
}