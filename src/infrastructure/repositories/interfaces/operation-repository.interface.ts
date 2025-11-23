import { Operation } from "src/domain/operation/operation.aggregate";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

export interface IOperationRepository {
  save(operation: Operation): Promise<void>;
  findById(id: Uuid): Promise<{
    id: string;
    name: string;
    status: string;
    sellerIds: string[];
  } | null>;
  findAll(): Promise<
    {
      id: string;
      name: string;
      status: string;
      sellerIds: string[];
    }[]
  >;
}
