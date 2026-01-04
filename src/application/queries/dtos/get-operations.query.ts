import { Query } from "@nestjs/cqrs";

export class GetOperationsQuery extends Query<
  {
    id: string;
    name: string;
    status: string;
  }[]
> {
  constructor() {
    super();
  }
}
