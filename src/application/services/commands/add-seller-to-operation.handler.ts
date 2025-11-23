import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, NotFoundException } from "@nestjs/common";
import { AddSellerToOperationCommand } from "./dtos/add-seller-to-operation.command";
import { IOperationRepository } from "src/infrastructure/repositories/interfaces/operation-repository.interface";
import { ISellerRepository } from "src/infrastructure/repositories/interfaces/seller-repository.interface";
import { Uuid } from "src/domain/@shared/interfaces/uuid";
import { OperationMapper } from "../@shared/operation.mapper";

@CommandHandler(AddSellerToOperationCommand)
export class AddSellerToOperationHandler
  implements
    ICommandHandler<
      AddSellerToOperationCommand,
      { operationId: string; sellerId: string }
    >
{
  constructor(
    @Inject("OperationRepository")
    private readonly operationRepository: IOperationRepository,
    @Inject("SellerRepository")
    private readonly sellerRepository: ISellerRepository,
  ) {}

  async execute(
    command: AddSellerToOperationCommand,
  ): Promise<{ operationId: string; sellerId: string }> {
    const operationId = new Uuid(command.id);
    const sellerId = new Uuid(command.sellerId);
    const operation = await this.operationRepository.findById(operationId);

    if (!operation) {
      throw new NotFoundException("Operation not found");
    }

    const seller = await this.sellerRepository.findById(sellerId);

    if (!seller) {
      throw new NotFoundException("Seller not found");
    }

    const operationEntity = OperationMapper.toDomain(operation);
    operationEntity.addSeller(sellerId);
    await this.operationRepository.save(operationEntity);

    return {
      operationId: operationEntity.id.getValue(),
      sellerId: sellerId.getValue(),
    };
  }
}
