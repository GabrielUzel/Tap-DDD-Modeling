import { Query } from "@nestjs/cqrs";

export class GetOperationByIdQuery extends Query<{
  operationId: string;
  name: string;
  status: string;
}> {
  constructor(public readonly operationId: string) {
    super();
  }
}
