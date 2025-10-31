// === CreateOperation ===
export interface CreateOperationInput {
  name: string;
}

export interface CreateOperationOutput {
  operationId: string;
}

export interface GetOperationsOutput {
  operations: {
    operationId: string;
    name: string;
    status: string;
  }[];
}

// === AddSeller ===
export interface AddSellerInput {
  operationId: string;
  sellerId: string;
}

export interface AddSellerOutput {
  operationId: string;
  sellerId: string;
}

// === AddCatalog ===
export interface AddCatalogInput {
  operationId: string;
  sellerId: string;
  catalogName: string;
  catalogType: string;
}

export interface AddCatalogOutput {
  operationId: string;
  sellerId: string;
  catalogId: string;
}

// === AddCatalogItem ===
export interface AddCatalogItemInput {
  operationId: string;
  sellerId: string;
  catalogId: string;
  itemName: string;
  itemPriceAmount: number;
  itemPriceSufix: string;
}

export interface AddCatalogItemOutput {
  operationId: string;
  sellerId: string;
  catalogId: string;
  itemId: string;
}

// === AddAssignment ===
export interface AddAssignmentInput {
  operationId: string;
  sellerId: string;
  operatorId: string;
  catalogId: string;
  role: string;
}

export interface AddAssignmentOutput {
  operationId: string;
  sellerId: string;
  operatorId: string;
  catalogId: string;
  role: string;
}

// === StartOperation ===
export interface StartOperationInput {
  operationId: string;
}

export interface StartOperationOutput {
  operationId: string;
}

// === GetOperationInput ===
export interface GetOperationInput {
  operationId: string;
}

// === GetOperationOutput ===
export interface GetOperationOutput {
  operationId: string;
  name: string;
  status: string;
}

// === GetSellers ===
export interface GetSellersInput {
  operationId: string;
}

export interface GetSellersOutput {
  operationId: string;
  sellers: {
    sellerId: string;
    name: string;
    email: string;
  }[];
}
