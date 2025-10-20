import { Uuid } from "../../utils/uuid";
import { Operation } from "../../domain/aggregates/operation.aggregate";

export interface OperationRepository {
  save(operation: Operation): Promise<void>;
  findById(id: Uuid): Promise<Operation | null>;
}
