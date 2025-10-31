import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import type { IOperationRepository } from "./interfaces/operation-repository.interface";
import { Operation } from "src/domain/operation/operation.aggregate";
import { Status } from "src/domain/@shared/value-objects/status.value";
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

  async findById(id: Uuid): Promise<Operation | null> {
    const operation = await this.prisma.operation.findUnique({
      where: { id: id.getValue() },
    });

    if (!operation) {
      return null;
    }

    return this.toDomainEntity(operation);
  }

  async findAll(): Promise<Operation[]> {
    const operations = await this.prisma.operation.findMany({
      orderBy: { createdAt: "desc" },
    });

    return operations.map((operation: OperationData) =>
      this.toDomainEntity(operation),
    );
  }

  private toDomainEntity(data: OperationData): Operation {
    return new Operation(
      new Uuid(data.id),
      data.name,
      Status.fromString(data.status),
      data.sellerIds.map((id) => new Uuid(id)),
    );
  }
}

type OperationData = {
  id: string;
  name: string;
  status: string;
  sellerIds: string[];
};
