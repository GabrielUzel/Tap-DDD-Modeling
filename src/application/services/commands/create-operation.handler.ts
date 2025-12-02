import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { CreateOperationCommand } from "./dtos/create-operation.command";
import { IOperationRepository } from "src/infrastructure/repositories/interfaces/operation-repository.interface";
import { Operation } from "src/domain/operation/operation.aggregate";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

@CommandHandler(CreateOperationCommand)
export class CreateOperationHandler
  implements ICommandHandler<CreateOperationCommand>
{
  constructor(
    @Inject("OperationRepository")
    private readonly operationRepository: IOperationRepository,
  ) {}

  async execute(
    command: CreateOperationCommand,
  ): Promise<{ operationId: string }> {
    const operation = Operation.create(Uuid.generate(), command.name);
    await this.operationRepository.save(operation);

    return {
      operationId: operation.getId().getValue(),
    };
  }
}
