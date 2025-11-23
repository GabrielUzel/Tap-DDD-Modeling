import { Operation } from "src/domain/operation/operation.aggregate";
import { Status } from "src/domain/@shared/value-objects/status.value";
import { Uuid } from "../../../domain/@shared/interfaces/uuid";

export class OperationMapper {
  static toDomain(operation: {
    id: string;
    name: string;
    status: string;
    sellerIds: string[];
  }): Operation {
    return new Operation(
      new Uuid(operation.id),
      operation.name,
      Status.fromString(operation.status),
      operation.sellerIds.map((id) => new Uuid(id)),
    );
  }
}
