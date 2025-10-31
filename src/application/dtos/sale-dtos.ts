// === RegisterSale ===
export interface RegisterSaleInput {
  sellerId: string;
  operationId: string;
  operatorId: string;
  catalogId: string;
  items: {
    itemId: string;
    quantity: number;
  }[];
}

export interface RegisterSaleOutput {
  saleId: string;
  totalAmount: number;
}

// === GetSale ===
export interface GetSaleInput {
  saleId: string;
}

export interface GetSaleOutput {
  saleId: string;
  sellerId: string;
  operationId: string;
  operatorId: string;
  catalogId: string;
  totalAmount: number;
  items: {
    itemId: string;
    quantity: number;
    salePrice: number;
    total: number;
  }[];
}
