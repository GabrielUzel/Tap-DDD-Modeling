import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, NotFoundException } from "@nestjs/common";
import { CreateAssignmentCommand } from "./dtos/create-assignment.command";
import type { IOperationRepository } from "src/infrastructure/repositories/interfaces/operation-repository.interface";
import type { ISellerRepository } from "src/infrastructure/repositories/interfaces/seller-repository.interface";
import { Role } from "src/domain/@shared/value-objects/role.value";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

@CommandHandler(CreateAssignmentCommand)
export class CreateAssignmentHandler implements ICommandHandler<CreateAssignmentCommand> {
  constructor(
    @Inject("OperationRepository")
    private readonly operationRepository: IOperationRepository,
    @Inject("SellerRepository")
    private readonly sellerRepository: ISellerRepository,
  ) {}

  async execute(command: CreateAssignmentCommand): Promise<{
    operationId: string;
    sellerId: string;
    operatorId: string;
    catalogId: string;
    role: string;
  }> {
    const operationId = new Uuid(command.operationId);
    const sellerId = new Uuid(command.sellerId);
    const operation = await this.operationRepository.findById(operationId);

    if (!operation) {
      throw new NotFoundException("Operation not found");
    }

    const seller = await this.sellerRepository.findById(sellerId);

    if (!seller) {
      throw new NotFoundException("Seller not found");
    }

    if (!operation.hasSeller(sellerId)) {
      throw new Error("Seller does not belong to this operation");
    }

    const operatorId = new Uuid(command.operatorId);
    const catalogId = new Uuid(command.catalogId);
    const role = Role.fromString(command.role);

    seller.assignOperator(operatorId, catalogId, role);
    await this.sellerRepository.save(seller);

    return {
      operationId: operation.id.getValue(),
      sellerId: sellerId.getValue(),
      operatorId: operatorId.getValue(),
      catalogId: catalogId.getValue(),
      role: role.getValue(),
    };
  }
}
