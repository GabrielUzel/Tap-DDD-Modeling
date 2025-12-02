import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject, NotFoundException } from "@nestjs/common";
import { GetOperationByIdQuery } from "./dtos/get-operation-by-id.query";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

@QueryHandler(GetOperationByIdQuery)
export class GetOperationByIdHandler
  implements IQueryHandler<GetOperationByIdQuery>
{
  constructor(@Inject() private readonly prisma: PrismaService) {}

  async execute(query: GetOperationByIdQuery): Promise<{
    id: string;
    name: string;
    status: string;
  }> {
    const operationId = new Uuid(query.operationId);
    const operation = await this.prisma.operation.findUnique({
      where: { id: operationId.getValue() },
    });

    if (!operation) {
      throw new NotFoundException("Operation not found");
    }

    return operation;
  }
}
