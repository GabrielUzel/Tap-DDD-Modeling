import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject, NotFoundException } from "@nestjs/common";
import { GetOperationByIdQuery } from "./dtos/get-operation-by-id.query";
import { IOperationRepository } from "src/infrastructure/repositories/interfaces/operation-repository.interface";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

@QueryHandler(GetOperationByIdQuery)
export class GetOperationByIdHandler
  implements
    IQueryHandler<
      GetOperationByIdQuery,
      {
        operationId: string;
        name: string;
        status: string;
      }
    >
{
  constructor(
    @Inject("OperationRepository")
    private readonly operationRepository: IOperationRepository,
  ) {}

  async execute(query: GetOperationByIdQuery): Promise<{
    operationId: string;
    name: string;
    status: string;
  }> {
    const operationId = new Uuid(query.operationId);
    const operation = await this.operationRepository.findById(operationId);

    if (!operation) {
      throw new NotFoundException("Operation not found");
    }

    return {
      operationId: operation.id,
      name: operation.name,
      status: operation.status,
    };
  }
}
