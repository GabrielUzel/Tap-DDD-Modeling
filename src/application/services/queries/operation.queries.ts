import { Injectable, Inject } from "@nestjs/common";
import type { IOperationRepository } from "src/application/repositories/interfaces/operation-repository.interface";
import type { ISellerRepository } from "src/application/repositories/interfaces/seller-repository.interface";
import type {
  GetOperationsOutput,
  GetOperationInput,
  GetOperationOutput,
  GetSellersInput,
  GetSellersOutput,
} from "../../dtos/operation-dtos";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

@Injectable()
export class OperationQueries {
  constructor(
    @Inject("OperationRepository")
    private readonly operationRepository: IOperationRepository,
    @Inject("SellerRepository")
    private readonly sellerRepository: ISellerRepository,
  ) {}

  public async getOperations(): Promise<GetOperationsOutput> {
    const operations = await this.operationRepository.findAll();

    return {
      operations: operations.map((operation) => ({
        operationId: operation.getId().getValue(),
        name: operation.name,
        status: operation.status.getValue(),
      })),
    };
  }

  public async getOperation(
    input: GetOperationInput,
  ): Promise<GetOperationOutput> {
    const operationId = new Uuid(input.operationId);
    const operation = await this.operationRepository.findById(operationId);

    if (!operation) {
      throw new Error("Operation not found");
    }

    return {
      operationId: operation.getId().getValue(),
      name: operation.name,
      status: operation.status.getValue(),
    };
  }

  public async getSellers(input: GetSellersInput): Promise<GetSellersOutput> {
    const operationId = new Uuid(input.operationId);
    const operation = await this.operationRepository.findById(operationId);

    if (!operation) {
      throw new Error("Operation not found");
    }

    const sellers = await this.sellerRepository.findMany(operation.sellerIds);

    return {
      operationId: operation.getId().getValue(),
      sellers: sellers.map((seller) => ({
        sellerId: seller.getId().getValue(),
        name: seller.name,
        email: seller.email.getValue(),
      })),
    };
  }
}
