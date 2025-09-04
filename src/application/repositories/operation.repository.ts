import type { Repository } from './@shared/repository.interface';
import { Operation } from '../../domain/aggregates/operation.aggregate';
import { right, left, type Either } from '../../shared/either.protocol';
import type { Uuid } from '../../shared/uuid';

export class OperationRepository implements Repository<Operation> {
  private operations: Operation[] = [];

  async findById(id: Uuid): Promise<Either<Error, Operation>> {
    const operation = this.operations.find(operation => operation.getId().equals(id));

    if (!operation) {
      return left(new Error("Operation not found"));
    }

    return right(operation);
  }

  async save(operation: Operation): Promise<Either<Error, void>> {
    this.operations.push(operation);
    return right(undefined);
  }
}