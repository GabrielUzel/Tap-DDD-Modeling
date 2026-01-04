import { Query } from "@nestjs/cqrs";

export class GetSellerByIdQuery extends Query<{
  id: string;
  name: string;
  email: string;
}> {
  constructor(public readonly sellerId: string) {
    super();
  }
}
