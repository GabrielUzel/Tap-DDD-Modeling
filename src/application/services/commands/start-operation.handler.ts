import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, NotFoundException } from "@nestjs/common";
import { StartOperationCommand } from "./dtos/start-operation.command";
import { IOperationRepository } from "src/infrastructure/repositories/interfaces/operation-repository.interface";
import { ISellerRepository } from "src/infrastructure/repositories/interfaces/seller-repository.interface";
import { OperationDomainService } from "src/domain/services/operation-domain-service";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

@CommandHandler(StartOperationCommand)
export class StartOperationHandler
  implements ICommandHandler<StartOperationCommand>
{
  private readonly operationDomainService: OperationDomainService;

  constructor(
    @Inject("OperationRepository")
    private readonly operationRepository: IOperationRepository,
    @Inject("SellerRepository")
    private readonly sellerRepository: ISellerRepository,
  ) {
    this.operationDomainService = new OperationDomainService();
  }

  async execute(
    command: StartOperationCommand,
  ): Promise<{ operationId: string }> {
    const operationId = new Uuid(command.operationId);
    const operation = await this.operationRepository.findById(operationId);

    if (!operation) {
      throw new NotFoundException("Operation not found");
    }

    const sellers = await this.sellerRepository.findMany(operation.sellerIds);

    this.operationDomainService.startOperation(operation, sellers);
    await this.operationRepository.save(operation);

    return {
      operationId: operation.id.getValue(),
    };
  }
}
