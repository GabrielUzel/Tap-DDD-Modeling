import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { GetOperationsQuery } from "./dtos/get-operations.query";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";

@QueryHandler(GetOperationsQuery)
export class GetOperationsHandler implements IQueryHandler<GetOperationsQuery> {
  constructor(@Inject() private readonly prisma: PrismaService) {}

  async execute(query: GetOperationsQuery): Promise<
    {
      id: string;
      name: string;
      status: string;
    }[]
  > {
    const operations = await this.prisma.operation.findMany();

    return operations;
  }
}
