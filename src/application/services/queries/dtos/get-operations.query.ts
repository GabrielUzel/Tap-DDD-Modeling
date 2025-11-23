import { Query } from "@nestjs/cqrs";

export class GetOperationsQuery extends Query<{
  operations: {
    operationId: string;
    name: string;
    status: string;
  }[];
}> {
  constructor() {
    super();
  }
}
