import { Injectable, Inject } from "@nestjs/common";
import type { ISellerRepository } from "src/application/repositories/interfaces/seller-repository.interface";
import type {
  GetSellerInput,
  GetSellerOutput,
  SellerHasOperatorInput,
  SellerHasOperatorOutput,
  GetOperatorsInput,
  GetOperatorsOutput,
  GetCatalogInput,
  GetCatalogOutput,
} from "../../dtos/seller-dtos";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

@Injectable()
export class SellerQueries {
  constructor(
    @Inject("SellerRepository")
    private sellerRepository: ISellerRepository,
  ) {}

  public async getSeller(input: GetSellerInput): Promise<GetSellerOutput> {
    const sellerId = new Uuid(input.sellerId);
    const seller = await this.sellerRepository.findById(sellerId);

    if (!seller) {
      throw new Error("Seller not found");
    }

    return {
      sellerId: seller.getId().getValue(),
      name: seller.name,
      email: seller.email.getValue(),
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

  public async getOperators(
    input: GetOperatorsInput,
  ): Promise<GetOperatorsOutput> {
    const seller = await this.sellerRepository.findById(
      new Uuid(input.sellerId),
    );

    if (!seller) {
      throw new Error("Seller not found");
    }

    const operators = seller.operators;

    return {
      operators: operators.map((operator) => ({
        operatorId: operator.getId().getValue(),
        operatorName: operator.name,
        operatorEmail: operator.email.getValue(),
      })),
    };
  }

  public async getCatalog(input: GetCatalogInput): Promise<GetCatalogOutput> {
    const seller = await this.sellerRepository.findById(
      new Uuid(input.sellerId),
    );

    if (!seller) {
      throw new Error("Seller not found");
    }

    const catalog = seller.getCatalog(new Uuid(input.catalogId));

    if (!catalog) {
      throw new Error("Catalog not found");
    }

    return {
      catalog: {
        catalogId: catalog.getId().getValue(),
        catalogName: catalog.name,
        catalogType: catalog.type.getValue(),
        items: catalog.catalogItems.map((item) => ({
          itemId: item.id.getValue(),
          itemName: item.name,
          itemPrice: item.price.getAmount(),
        })),
      },
    };
  }
}
