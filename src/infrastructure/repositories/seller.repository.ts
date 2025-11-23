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

  // ! Ambos findbyid e findmany, retornam todo o conteúdo de um seller, todos seus ooperators e catalogs, isso não é muita coisa?
  // Ou o próprio graphql consegue otimizar isso?
  async findById(id: Uuid): Promise<{
    id: string;
    name: string;
    email: string;
    operators: { id: string; name: string; email: string }[];
    catalogs: {
      id: string;
      name: string;
      type: string;
      items: {
        id: string;
        name: string;
        priceAmountInCents: number;
        priceSuffix: string;
      }[];
    }[];
    assignments: {
      id: string;
      operatorId: string;
      catalogId: string;
      role: string;
    }[];
  } | null> {
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

    return {
      id: seller.id,
      name: seller.name,
      email: seller.email,
      operators: seller.operators.map((operator) => ({
        id: operator.id,
        name: operator.name,
        email: operator.email,
      })),
      catalogs: seller.catalogs.map((catalog) => ({
        id: catalog.id,
        name: catalog.name,
        type: catalog.type,
        items: catalog.items.map((item) => ({
          id: item.id,
          name: item.name,
          priceAmountInCents: item.priceAmountInCents,
          priceSuffix: item.priceSuffix,
        })),
      })),
      assignments: seller.assignments.map((assignment) => ({
        id: assignment.id,
        operatorId: assignment.operatorId,
        catalogId: assignment.catalogId,
        role: assignment.role,
      })),
    };
  }

  async findMany(ids: string[]): Promise<
    {
      id: string;
      name: string;
      email: string;
      operators: {
        id: string;
        name: string;
        email: string;
      }[];
      catalogs: {
        id: string;
        name: string;
        type: string;
        items: {
          id: string;
          name: string;
          priceAmountInCents: number;
          priceSuffix: string;
        }[];
      }[];
      assignments: {
        id: string;
        operatorId: string;
        catalogId: string;
        role: string;
      }[];
    }[]
  > {
    const sellers = await this.prisma.seller.findMany({
      where: {
        id: {
          in: ids.map((id) => id),
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

    return sellers.map((seller) => ({
      id: seller.id,
      name: seller.name,
      email: seller.email,
      operators: seller.operators.map((operator) => ({
        id: operator.id,
        name: operator.name,
        email: operator.email,
      })),
      catalogs: seller.catalogs.map((catalog) => ({
        id: catalog.id,
        name: catalog.name,
        type: catalog.type,
        items: catalog.items.map((item) => ({
          id: item.id,
          name: item.name,
          priceAmountInCents: item.priceAmountInCents,
          priceSuffix: item.priceSuffix,
        })),
      })),
      assignments: seller.assignments.map((assignment) => ({
        id: assignment.id,
        operatorId: assignment.operatorId,
        catalogId: assignment.catalogId,
        role: assignment.role,
      })),
    }));
  }
}
