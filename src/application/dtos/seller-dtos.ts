// === CreateSeller ===
export type CreateSellerInput = {
  name: string;
  email: string;
};

export type CreateSellerOutput = {
  sellerId: string;
};

// === GetSeller ===
export type GetSellerInput = {
  sellerId: string;
};

export type GetSellerOutput = {
  sellerId: string;
  name: string;
  email: string;
};

// === AddOperatorToSellerPool ===
export type AddOperatorToSellerPoolInput = {
  sellerId: string;
  operatorName: string;
  operatorEmail: string;
};

export type AddOperatorToSellerPoolOutput = {
  sellerId: string;
  operatorId: string;
};

// === SellerHasOperator ===
export type SellerHasOperatorInput = {
  sellerId: string;
  operatorId: string;
};

export type SellerHasOperatorOutput = {
  hasOperator: boolean;
};

// === GetOperators ===
export type GetOperatorsInput = {
  sellerId: string;
};

export type GetOperatorsOutput = {
  operators: {
    operatorId: string;
    operatorName: string;
    operatorEmail: string;
  }[];
};

// === GetCatalog ===
export type GetCatalogInput = {
  sellerId: string;
  catalogId: string;
};

export type GetCatalogOutput = {
  catalog: {
    catalogId: string;
    catalogName: string;
    catalogType: string;
    items: {
      itemId: string;
      itemName: string;
      itemPrice: number;
    }[];
  };
};

// === UpdateCatalog ===
export type UpdateCatalogInput = {
  sellerId: string;
  catalogId: string;
  catalogName?: string;
  catalogType?: string;
  items?: {
    itemId: string;
    itemName: string;
    itemPrice: number;
  }[];
};

export type UpdateCatalogOutput = {
  sellerId: string;
};
