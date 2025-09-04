import type { Either } from "../../../shared/either.protocol";
import type { Uuid } from "../../../shared/uuid";

export interface Repository<T> {
  findById(id: Uuid): Promise<Either<Error, T>>;
  save(object: T): Promise<Either<Error, void>>;
}