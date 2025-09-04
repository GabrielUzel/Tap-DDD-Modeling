import type { CreateOperatorInput, CreateOperatorOutput } from '../dtos/operator/create-operator.dto';
import { OperatorRepository } from '../repositories/operator.repository';
import { Operator } from '../../domain/entities/operator.entity';
import { Uuid } from '../../shared/uuid';
import { Email } from '../../domain/value-objects/email.value';
import { type Either, right, left } from '../../shared/either.protocol';

export class OperatorService {
  private operatorRepository: OperatorRepository;

  constructor(operatorRepository: OperatorRepository) {
    this.operatorRepository = operatorRepository;
  }

  public async createOperator(
    input: CreateOperatorInput
  ): Promise<Either<Error, CreateOperatorOutput>> {
    try {
      const operator = Operator.create(Uuid.generate(), input.name, Email.create(input.email));
      await this.operatorRepository.save(operator);

      return right({
        operatorId: operator.getId().getValue(),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return left(new Error(error.message));
      }
      
      return left(new Error("An unknown error occurred"));
    }
  }
}