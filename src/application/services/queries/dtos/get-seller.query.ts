import { Query } from "@nestjs/cqrs";

export class GetSellerQuery extends Query<{
  sellerId: string;
  name: string;
  email: string;
}> {
  constructor(public readonly sellerId: string) {
    super();
  }
}
