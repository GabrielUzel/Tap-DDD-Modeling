export type RegisterSaleInput = {
  sellerId: string;
  operationId: string;
  operatorId: string;
  catalogId: string;
  items: {
    itemId: string;
    quantity: number;
  }[];
}

export type RegisterSaleOutput = {
  saleId: string;
  sellerId: string;
  operationId: string;
  totalAmount: number;
}