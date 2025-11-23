import { Query } from "@nestjs/cqrs";

export class GetSellersQuery extends Query<{
  operationId: string;
  sellers: {
    sellerId: string;
    name: string;
    email: string;
  }[];
}> {
  constructor(public readonly operationId: string) {
    super();
  }
}
