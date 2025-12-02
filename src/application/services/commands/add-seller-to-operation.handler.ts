import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, NotFoundException } from "@nestjs/common";
import { AddSellerToOperationCommand } from "./dtos/add-seller-to-operation.command";
import { IOperationRepository } from "src/infrastructure/repositories/interfaces/operation-repository.interface";
import { ISellerRepository } from "src/infrastructure/repositories/interfaces/seller-repository.interface";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

@CommandHandler(AddSellerToOperationCommand)
export class AddSellerToOperationHandler
  implements ICommandHandler<AddSellerToOperationCommand>
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

    operation.addSeller(sellerId);
    await this.operationRepository.save(operation);

    return {
      operationId: operation.id.getValue(),
      sellerId: sellerId.getValue(),
    };
  }
}
