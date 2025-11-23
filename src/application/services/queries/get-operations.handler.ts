import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { GetOperationsQuery } from "./dtos/get-operations.query";
import { IOperationRepository } from "src/infrastructure/repositories/interfaces/operation-repository.interface";

@QueryHandler(GetOperationsQuery)
export class GetOperationsHandler
  implements
    IQueryHandler<
      GetOperationsQuery,
      {
        operations: {
          operationId: string;
          name: string;
          status: string;
        }[];
      }
    >
{
  constructor(
    @Inject("OperationRepository")
    private readonly operationRepository: IOperationRepository,
  ) {}

  async execute(query: GetOperationsQuery): Promise<{
    operations: {
      operationId: string;
      name: string;
      status: string;
    }[];
  }> {
    const operations = await this.operationRepository.findAll();

    return {
      operations: operations.map((operation) => ({
        operationId: operation.id,
        name: operation.name,
        status: operation.status,
      })),
    };
  }
}
