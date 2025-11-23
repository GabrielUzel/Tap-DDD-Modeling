import { Query } from "@nestjs/cqrs";

export class GetOperatorsQuery extends Query<{
  operators: {
    operatorId: string;
    operatorName: string;
    operatorEmail: string;
  }[];
}> {
  constructor(public readonly sellerId: string) {
    super();
  }
}
