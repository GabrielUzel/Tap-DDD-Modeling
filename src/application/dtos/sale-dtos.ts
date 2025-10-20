// === RegisterSale ===
export interface RegisterSaleInput {
  sellerId: string;
  operationId: string;
  operatorId: string;
  catalogId: string;
  itemId: string;
  items: {
    itemId: string;
    quantity: number;
  }[];
}

export interface RegisterSaleOutput {
  saleId: string;
  sellerId: string;
  operationId: string;
  totalAmount: number;
}
