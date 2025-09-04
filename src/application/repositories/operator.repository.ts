import type { Repository } from './@shared/repository.interface';
import { Operator } from '../../domain/entities/operator.entity';
import { right, left, type Either } from '../../shared/either.protocol';
import type { Uuid } from '../../shared/uuid';

export class OperatorRepository implements Repository<Operator> {
  private operators: Operator[] = [];

  async findById(id: Uuid): Promise<Either<Error, Operator>> {
    const operator = this.operators.find(operator => operator.getId().equals(id));

    if (!operator) {
      return left(new Error("Operator not found"));
    }

    return right(operator);
  }

  async save(operator: Operator): Promise<Either<Error, void>> {
    this.operators.push(operator);
    return right(undefined);
  }
}