import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { ISaleRepository } from "./interfaces/sale-repository.interface";
import { Sale } from "src/domain/sale/sale.aggregate";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

@Injectable()
export class SaleRepository implements ISaleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(sale: Sale): Promise<void> {
    await this.prisma.sale.create({
      data: {
        id: sale.getId().getValue(),
        sellerId: sale.sellerId.getValue(),
        operatorId: sale.operatorId.getValue(),
        catalogId: sale.catalogId.getValue(),
        operationId: sale.operationId.getValue(),
        totalAmountInCents: sale.totalAmountInCents,
        items: {
          create: sale.items.map((item) => ({
            catalogItemId: item.getValue().catalogItemId.getValue(),
            quantity: item.getValue().quantity,
            priceAmountInCents: item.getValue().salePrice.getAmount(),
            priceSuffix: item.getValue().salePrice.getSufix(),
          })),
        },
      },
    });
  }

  async findById(id: Uuid): Promise<{
    id: string;
    sellerId: string;
    operatorId: string;
    catalogId: string;
    operationId: string;
    totalAmountInCents: number;
    items: {
      catalogItemId: string;
      quantity: number;
      priceAmountInCents: number;
      priceSuffix: string;
    }[];
  } | null> {
    const sale = await this.prisma.sale.findUnique({
      where: { id: id.getValue() },
      include: {
        items: true,
      },
    });

    if (!sale) {
      return null;
    }

    return {
      id: sale.id,
      sellerId: sale.sellerId,
      operatorId: sale.operatorId,
      catalogId: sale.catalogId,
      operationId: sale.operationId,
      totalAmountInCents: sale.totalAmountInCents,
      items: sale.items.map((item) => ({
        catalogItemId: item.catalogItemId,
        quantity: item.quantity,
        priceAmountInCents: item.priceAmountInCents,
        priceSuffix: item.priceSuffix,
      })),
    };
  }
}
