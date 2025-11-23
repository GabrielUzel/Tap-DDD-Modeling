import { Query } from "@nestjs/cqrs";

export class SellerHasOperatorQuery extends Query<{ hasOperator: boolean }> {
  constructor(
    public readonly sellerId: string,
    public readonly operatorId: string,
  ) {
    super();
  }
}
