import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject, NotFoundException } from "@nestjs/common";
import { GetSaleQuery } from "./dtos/get-sale.query";
import { ISaleRepository } from "src/infrastructure/repositories/interfaces/sale-repository.interface";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

@QueryHandler(GetSaleQuery)
export class GetSaleHandler
  implements
    IQueryHandler<
      GetSaleQuery,
      {
        saleId: string;
        sellerId: string;
        operationId: string;
        operatorId: string;
        catalogId: string;
        totalAmountInCents: number;
        items: {
          catalogItemId: string;
          quantity: number;
          salePriceInCents: number;
          total: number;
        }[];
      }
    >
{
  constructor(
    @Inject("SaleRepository")
    private readonly saleRepository: ISaleRepository,
  ) {}

  async execute(query: GetSaleQuery): Promise<{
    saleId: string;
    sellerId: string;
    operationId: string;
    operatorId: string;
    catalogId: string;
    totalAmountInCents: number;
    items: {
      catalogItemId: string;
      quantity: number;
      salePriceInCents: number;
      total: number;
    }[];
  }> {
    const saleId = new Uuid(query.saleId);
    const sale = await this.saleRepository.findById(saleId);

    if (!sale) {
      throw new NotFoundException("Sale not found");
    }

    return {
      saleId: sale.id,
      sellerId: sale.sellerId,
      operatorId: sale.operatorId,
      catalogId: sale.catalogId,
      operationId: sale.operationId,
      totalAmountInCents: sale.totalAmountInCents,
      items: sale.items.map((item) => ({
        catalogItemId: item.catalogItemId,
        quantity: item.quantity,
        salePriceInCents: item.priceAmountInCents,
        total: item.quantity * item.priceAmountInCents,
      })),
    };
  }
}
