import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import type { IOperationRepository } from "./interfaces/operation-repository.interface";
import { Operation } from "src/domain/operation/operation.aggregate";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

@Injectable()
export class OperationRepository implements IOperationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(operation: Operation): Promise<void> {
    const data = {
      id: operation.getId().getValue(),
      name: operation.name,
      status: operation.status.getValue(),
      sellerIds: operation.sellerIds.map((id) => id.getValue()),
    };

    await this.prisma.operation.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async findById(id: Uuid): Promise<{
    id: string;
    name: string;
    status: string;
    sellerIds: string[];
  } | null> {
    const operation = await this.prisma.operation.findUnique({
      where: { id: id.getValue() },
    });

    if (!operation) {
      return null;
    }

    return {
      id: operation.id,
      name: operation.name,
      status: operation.status,
      sellerIds: operation.sellerIds.map((id) => id),
    };
  }

  async findAll(): Promise<
    {
      id: string;
      name: string;
      status: string;
      sellerIds: string[];
    }[]
  > {
    const operations = await this.prisma.operation.findMany({
      orderBy: { createdAt: "desc" },
    });

    return operations.map((operation) => ({
      id: operation.id,
      name: operation.name,
      status: operation.status,
      sellerIds: operation.sellerIds.map((id) => id),
    }));
  }
}
