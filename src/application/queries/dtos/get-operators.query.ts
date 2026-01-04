import { Query } from "@nestjs/cqrs";

export class GetOperatorsQuery extends Query<
  {
    id: string;
    name: string;
    email: string;
  }[]
> {
  constructor(public readonly sellerId: string) {
    super();
  }
}
