import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { ISellerRepository } from "./interfaces/seller-repository.interface";
import { Seller } from "src/domain/seller/seller.aggregate";
import { Operator } from "src/domain/seller/operator.entity";
import { Catalog } from "src/domain/seller/catalog.entity";
import { CatalogItem } from "src/domain/seller/catalog-item.entity";
import { Email } from "src/domain/@shared/value-objects/email.value";
import { CatalogType } from "src/domain/@shared/value-objects/catalog-type.value";
import {
  Money,
  MoneySufix,
} from "src/domain/@shared/value-objects/money.value";
import { Assignment } from "src/domain/@shared/value-objects/assignment.value";
import { Role } from "src/domain/@shared/value-objects/role.value";
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
                priceAmount: item.price.getAmount(),
                priceSuffix: item.price.getSufix(),
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

    return this.toDomainEntity(seller);
  }

  async findMany(ids: Uuid[]): Promise<Seller[]> {
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

    return sellers.map((seller: SellerData) => this.toDomainEntity(seller));
  }

  private toDomainEntity(data: SellerData): Seller {
    const operators = data.operators.map(
      (operator) =>
        new Operator(
          new Uuid(operator.id),
          operator.name,
          Email.create(operator.email),
        ),
    );

    const catalogs = data.catalogs.map((catalog) => {
      const items = catalog.items.map((item) =>
        CatalogItem.create(
          new Uuid(item.id),
          item.name,
          Money.create(item.priceAmount, item.priceSuffix as MoneySufix),
        ),
      );

      return new Catalog(
        new Uuid(catalog.id),
        catalog.name,
        CatalogType.fromString(catalog.type),
        items,
      );
    });

    const assignments = data.assignments.map((assignment) =>
      Assignment.create(
        new Uuid(assignment.operatorId),
        new Uuid(assignment.catalogId),
        Role.fromString(assignment.role),
      ),
    );

    return new Seller(
      new Uuid(data.id),
      data.name,
      Email.create(data.email),
      catalogs,
      operators,
      assignments,
    );
  }
}

type OperatorData = {
  id: string;
  name: string;
  email: string;
};

type CatalogItemData = {
  id: string;
  name: string;
  priceAmount: number;
  priceSuffix: string;
};

type CatalogData = {
  id: string;
  name: string;
  type: string;
  items: CatalogItemData[];
};

type AssignmentData = {
  operatorId: string;
  catalogId: string;
  role: string;
};

type SellerData = {
  id: string;
  name: string;
  email: string;
  operators: OperatorData[];
  catalogs: CatalogData[];
  assignments: AssignmentData[];
};
