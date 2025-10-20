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

// === AddOperator ===
export interface AddOperatorInput {
  operationId: string;
  sellerId: string;
  operatorId: string;
}

export interface AddOperatorOutput {
  operationId: string;
  sellerId: string;
  operatorId: string;
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

// === CreateOperation ===
export interface CreateOperationInput {
  name: string;
}

export interface CreateOperationOutput {
  operationId: string;
}

// === StartOperation ===
export interface StartOperationInput {
  operationId: string;
}
