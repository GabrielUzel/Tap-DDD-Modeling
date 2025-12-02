import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { ISellerRepository } from "./interfaces/seller-repository.interface";
import { Seller } from "src/domain/seller/seller.aggregate";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

@Injectable()
export class SellerRepository implements ISellerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(seller: Seller): Promise<void> {
    const sellerId = seller.getId().getValue();

    await this.prisma.$transaction(async (tx) => {
      await tx.seller.upsert({
        where: { id: sellerId },
        create: {
          id: sellerId,
          name: seller.name,
          email: seller.email.getValue(),
        },
        update: {
          name: seller.name,
          email: seller.email.getValue(),
        },
      });

      await tx.operator.deleteMany({
        where: { sellerId },
      });

      if (seller.operators.length > 0) {
        await tx.operator.createMany({
          data: seller.operators.map((operator) => ({
            id: operator.getId().getValue(),
            name: operator.name,
            email: operator.email.getValue(),
            sellerId,
          })),
        });
      }

      await tx.catalog.deleteMany({
        where: { sellerId },
      });

      for (const catalog of seller.catalogs) {
        await tx.catalog.create({
          data: {
            id: catalog.getId().getValue(),
            name: catalog.name,
            type: catalog.type.getValue(),
            sellerId,
            items: {
              create: catalog.catalogItems.map((item) => ({
                id: item.getId().getValue(),
                name: item.name,
                priceAmountInCents: item.priceInCents.getAmount(),
                priceSuffix: item.priceInCents.getSufix(),
              })),
            },
          },
        });
      }

      await tx.assignment.deleteMany({
        where: { sellerId },
      });

      if (seller.assignments.length > 0) {
        await tx.assignment.createMany({
          data: seller.assignments.map((assignment) => ({
            operatorId: assignment.operatorId.getValue(),
            catalogId: assignment.catalogId.getValue(),
            role: assignment.role.getValue(),
            sellerId,
          })),
        });
      }
    });
  }

  async findById(id: Uuid): Promise<Seller | null> {
    const seller = await this.prisma.seller.findUnique({
      where: { id: id.getValue() },
      include: {
        operators: true,
        catalogs: {
          include: {
            items: true,
          },
        },
        assignments: true,
      },
    });

    if (!seller) {
      return null;
    }

    return Seller.fromJSON(seller);
  }

  async findMany(ids: Uuid[]): Promise<Seller[]> {
    if (!ids.length) {
      return [];
    }

    const sellers = await this.prisma.seller.findMany({
      where: {
        id: {
          in: ids.map((id) => id.getValue()),
        },
      },
      include: {
        operators: true,
        catalogs: {
          include: {
            items: true,
          },
        },
        assignments: true,
      },
    });

    return sellers.map(Seller.fromJSON);
  }
}
