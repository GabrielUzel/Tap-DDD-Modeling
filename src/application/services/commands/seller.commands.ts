import { Injectable, Inject } from "@nestjs/common";
import type { ISellerRepository } from "src/application/repositories/interfaces/seller-repository.interface";
import type {
  CreateSellerInput,
  CreateSellerOutput,
  AddOperatorToSellerPoolInput,
  AddOperatorToSellerPoolOutput,
  UpdateCatalogInput,
  UpdateCatalogOutput,
} from "../../dtos/seller-dtos";
import { Seller } from "src/domain/seller/seller.aggregate";
import { Operator } from "src/domain/seller/operator.entity";
import { CatalogItem } from "src/domain/seller/catalog-item.entity";
import { Email } from "src/domain/@shared/value-objects/email.value";
import { CatalogType } from "src/domain/@shared/value-objects/catalog-type.value";
import { Money } from "src/domain/@shared/value-objects/money.value";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

@Injectable()
export class SellerCommands {
  constructor(
    @Inject("SellerRepository")
    private sellerRepository: ISellerRepository,
  ) {}

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
    const operator = Operator.create(
      Uuid.generate(),
      input.operatorName,
      Email.create(input.operatorEmail),
    );
    const seller = await this.sellerRepository.findById(sellerId);

    if (!seller) {
      throw new Error("Seller not found");
    }

    seller.addOperatorToPool(operator);
    await this.sellerRepository.save(seller);

    return {
      sellerId: seller.getId().getValue(),
      operatorId: operator.getId().getValue(),
    };
  }

  public async updateCatalog(
    input: UpdateCatalogInput,
  ): Promise<UpdateCatalogOutput> {
    const seller = await this.sellerRepository.findById(
      new Uuid(input.sellerId),
    );

    if (!seller) {
      throw new Error("Seller not found");
    }

    let catalogItems: CatalogItem[] | undefined;
    if (input.items) {
      catalogItems = input.items.map((item) =>
        CatalogItem.create(
          new Uuid(item.itemId),
          item.itemName,
          Money.create(item.itemPrice, "BRL"),
        ),
      );
    }

    seller.updateCatalog(
      new Uuid(input.catalogId),
      input.catalogName,
      input.catalogType,
      catalogItems,
    );

    await this.sellerRepository.save(seller);

    return {
      sellerId: seller.getId().getValue(),
    };
  }
}
