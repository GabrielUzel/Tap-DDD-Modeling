import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, NotFoundException } from "@nestjs/common";
import { StartOperationCommand } from "./dtos/start-operation.command";
import { IOperationRepository } from "src/infrastructure/repositories/interfaces/operation-repository.interface";
import { ISellerRepository } from "src/infrastructure/repositories/interfaces/seller-repository.interface";
import { StartOperationDomainService } from "src/domain/services/start-operation.service";
import { Uuid } from "src/domain/@shared/interfaces/uuid";
import { OperationMapper } from "../@shared/operation.mapper";
import { SellerMapper } from "../@shared/seller.mapper";

@CommandHandler(StartOperationCommand)
export class StartOperationHandler
  implements ICommandHandler<StartOperationCommand, { operationId: string }>
{
  private readonly startOperationDomainService: StartOperationDomainService;

  constructor(
    @Inject("OperationRepository")
    private readonly operationRepository: IOperationRepository,
    @Inject("SellerRepository")
    private readonly sellerRepository: ISellerRepository,
  ) {
    this.startOperationDomainService = new StartOperationDomainService();
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

    const sellersEntities = sellers.map((seller) =>
      SellerMapper.toDomain(seller),
    );

    this.startOperationDomainService.validateOperationCanStart(sellersEntities);

    const operationEntity = OperationMapper.toDomain({
      id: operation.id,
      name: operation.name,
      status: operation.status,
      sellerIds: operation.sellerIds,
    });

    operationEntity.startOperation();
    await this.operationRepository.save(operationEntity);

    return {
      operationId: operationEntity.id.getValue(),
    };
  }
}
