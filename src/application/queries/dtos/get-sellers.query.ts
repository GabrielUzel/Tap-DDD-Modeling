import { Query } from "@nestjs/cqrs";

export class GetSellersQuery extends Query<
  {
    id: string;
    name: string;
    email: string;
  }[]
> {
  constructor(public readonly operationId: string) {
    super();
  }
}
