import type { SellerRepository } from "../repositories/seller.repository";
import type {
  AddOperatorToSellerPoolInput,
  AddOperatorToSellerPoolOutput,
  SellerHasOperatorInput,
  SellerHasOperatorOutput,
  CreateSellerInput,
  CreateSellerOutput,
} from "../../application/dtos/seller-dtos";
import { Uuid } from "../../utils/uuid";
import { Email } from "../../domain/value-objects/email.value";
import { Seller } from "../../domain/aggregates/seller.aggregate";

export class SellerService {
  private sellerRepository: SellerRepository;

  constructor(sellerRepository: SellerRepository) {
    this.sellerRepository = sellerRepository;
  }

  public async createSeller(
    input: CreateSellerInput,
  ): Promise<CreateSellerOutput> {
    const seller = Seller.create(
      Uuid.generate(),
      input.name,
      Email.create(input.email),
    );
    await this.sellerRepository.save(seller);

    return {
      sellerId: seller.getId().getValue(),
    };
  }

  public async addOperatorToSellerPool(
    input: AddOperatorToSellerPoolInput,
  ): Promise<AddOperatorToSellerPoolOutput> {
    const sellerId = new Uuid(input.sellerId);
    const operatorId = new Uuid(input.operatorId);

    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw new Error("Seller not found");
    }

    seller.addOperatorToPool(operatorId);
    await this.sellerRepository.save(seller);

    return {
      sellerId: seller.getId().getValue(),
      operatorId: operatorId.getValue(),
    };
  }

  public async sellerHasOperator(
    input: SellerHasOperatorInput,
  ): Promise<SellerHasOperatorOutput> {
    const sellerId = new Uuid(input.sellerId);
    const operatorId = new Uuid(input.operatorId);

    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw new Error("Seller not found");
    }

    const hasOperator = seller.operatorIsInPool(operatorId);

    return {
      hasOperator,
    };
  }
}
