import { Injectable, Inject } from "@nestjs/common";
import type { ISaleRepository } from "src/application/repositories/interfaces/sale-repository.interface";
import type { GetSaleInput, GetSaleOutput } from "../../dtos/sale-dtos";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

@Injectable()
export class SaleQueries {
  constructor(
    @Inject("SaleRepository")
    private saleRepository: ISaleRepository,
  ) {}

  public async getSale(input: GetSaleInput): Promise<GetSaleOutput> {
    const saleId = new Uuid(input.saleId);
    const sale = await this.saleRepository.findById(saleId);

    if (!sale) {
      throw new Error("Sale not found");
    }

    return {
      saleId: sale.getId().getValue(),
      sellerId: sale.sellerId.getValue(),
      operatorId: sale.operatorId.getValue(),
      catalogId: sale.catalogId.getValue(),
      operationId: sale.operationId.getValue(),
      totalAmount: sale.totalAmount,
      items: sale.items.map((item) => ({
        itemId: item.getValue().catalogItemId.getValue(),
        quantity: item.getValue().quantity,
        salePrice: item.getValue().salePrice.getAmount(),
        total: item.getTotal(),
      })),
    };
  }
}
