// === AddOperatorToSellerPool ===
export type AddOperatorToSellerPoolInput = {
  sellerId: string;
  operatorId: string;
};

export type AddOperatorToSellerPoolOutput = {
  sellerId: string;
  operatorId: string;
};

// === CreateSeller ===
export type CreateSellerInput = {
  name: string;
  email: string;
};

export type CreateSellerOutput = {
  sellerId: string;
};

// === SellerHasOperator ===
export type SellerHasOperatorInput = {
  sellerId: string;
  operatorId: string;
};

export type SellerHasOperatorOutput = {
  hasOperator: boolean;
};
