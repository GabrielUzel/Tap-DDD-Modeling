import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { ISaleRepository } from "./interfaces/sale-repository.interface";
import { Sale } from "src/domain/sale/sale.aggregate";
import { SaleItem } from "src/domain/@shared/value-objects/sale-item.value";
import { Money } from "src/domain/@shared/value-objects/money.value";
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
        totalAmount: sale.totalAmount,
        items: {
          create: sale.items.map((item) => ({
            itemId: item.getValue().catalogItemId.getValue(),
            quantity: item.getValue().quantity,
            priceAmount: item.getValue().salePrice.getAmount(),
            priceSuffix: item.getValue().salePrice.getSufix(),
          })),
        },
      },
    });
  }

  async findById(id: Uuid): Promise<Sale | null> {
    const sale = await this.prisma.sale.findUnique({
      where: { id: id.getValue() },
      include: {
        items: true,
      },
    });

    if (!sale) {
      return null;
    }

    return this.toDomainEntity(sale);
  }

  private toDomainEntity(data: SaleData): Sale {
    const items = data.items.map((item: any) =>
      SaleItem.create(
        new Uuid(item.itemId),
        item.quantity,
        Money.create(item.priceAmount, item.priceSuffix),
      ),
    );

    return new Sale(
      new Uuid(data.id),
      new Uuid(data.sellerId),
      new Uuid(data.operatorId),
      new Uuid(data.catalogId),
      new Uuid(data.operationId),
      items,
      data.totalAmount,
    );
  }
}

type SaleItemData = {
  itemId: string;
  quantity: number;
  priceAmount: number;
  priceSuffix: string;
};

type SaleData = {
  id: string;
  sellerId: string;
  operatorId: string;
  catalogId: string;
  operationId: string;
  totalAmount: number;
  items: SaleItemData[];
};
