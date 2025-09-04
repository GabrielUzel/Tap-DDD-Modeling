import type { CreateSellerInput, CreateSellerOutput } from "../../application/dtos/seller/create-seller.dto";
import type { AddOperatorToSellerPoolInput, AddOperatorToSellerPoolOutput } from "../../application/dtos/seller/add-operator-to-seller-pool.dto";
import type { SellerHasOperatorInput, SellerHasOperatorOutput } from "../../application/dtos/seller/seller-has-operator.dto";
import { Uuid } from "../../shared/uuid";
import { Email } from "../../domain/value-objects/email.value";
import { Seller } from "../../domain/aggregates/seller.aggregate";
import { SellerRepository } from "../repositories/seller.repository";
import { OperatorRepository } from "../repositories/operator.repository";
import { type Either, right, left, isLeft } from "../../shared/either.protocol";

export class SellerService {
  private sellerRepository: SellerRepository;
  private operatorRepository: OperatorRepository;

  constructor(
    sellerRepository: SellerRepository,
    operatorRepository: OperatorRepository
  ) {
    this.sellerRepository = sellerRepository;
    this.operatorRepository = operatorRepository;
  }

  public async createSeller(
    input: CreateSellerInput
  ): Promise<Either<Error, CreateSellerOutput>> {
    try {
      const seller = Seller.create(Uuid.generate(), input.name, Email.create(input.email));
      await this.sellerRepository.save(seller);

      return right({
        sellerId: seller.getId().getValue(),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return left(new Error(error.message));
      }
      
      return left(new Error("An unknown error occurred"));
    }
  }

  public async addOperatorToSellerPool(
    input: AddOperatorToSellerPoolInput
  ): Promise<Either<Error, AddOperatorToSellerPoolOutput>> {
    try {
      const sellerId = new Uuid(input.sellerId);
      const operatorId = new Uuid(input.operatorId);
      
      const sellerResult = await this.sellerRepository.findById(sellerId);
      if (isLeft(sellerResult)) {
        return left(new Error("Seller not found"));
      }
      const seller = sellerResult.right;
  
      const operatorResult = await this.operatorRepository.findById(operatorId);
      if (isLeft(operatorResult)) {
        return left(new Error("Operator not found"));
      }
      const operator = operatorResult.right;
  
      seller.addOperator(operator);
  
      await this.sellerRepository.save(seller);
  
      return right({
        sellerId: seller.getId().getValue(),
        operatorId: operatorId.getValue(),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return left(new Error(error.message));
      }
      
      return left(new Error("An unknown error occurred"));
    }
  }

  public async sellerHasOperator(
    input: SellerHasOperatorInput
  ): Promise<Either<Error, SellerHasOperatorOutput>> {
    try {
      const sellerId = new Uuid(input.sellerId);
      const operatorId = new Uuid(input.operatorId);
      
      const sellerResult = await this.sellerRepository.findById(sellerId);
      if (isLeft(sellerResult)) {
        return left(new Error("Seller not found"));
      }
      const seller = sellerResult.right;

      const hasOperator = seller.hasOperator(operatorId);
      
      return right({
        sellerId: seller.getId().getValue(),
        operatorId: operatorId.getValue(),
        hasOperator,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return left(new Error(error.message));
      }
      
      return left(new Error("An unknown error occurred"));
    }
  }
}