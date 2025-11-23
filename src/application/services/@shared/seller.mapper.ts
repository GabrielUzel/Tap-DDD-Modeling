import { Seller } from "src/domain/seller/seller.aggregate";
import { Catalog } from "src/domain/seller/catalog.entity";
import { CatalogItem } from "src/domain/seller/catalog-item.entity";
import { Operator } from "src/domain/seller/operator.entity";
import { Assignment } from "src/domain/@shared/value-objects/assignment.value";
import { Email } from "src/domain/@shared/value-objects/email.value";
import { Money } from "src/domain/@shared/value-objects/money.value";
import { MoneySufix } from "src/domain/@shared/value-objects/money.value";
import { CatalogType } from "src/domain/@shared/value-objects/catalog-type.value";
import { Role } from "src/domain/@shared/value-objects/role.value";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

export class SellerMapper {
  static toDomain(seller: {
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
      operatorId: string;
      catalogId: string;
      role: string;
    }[];
  }): Seller {
    return new Seller(
      new Uuid(seller.id),
      seller.name,
      Email.create(seller.email),
      seller.catalogs.map(
        (catalog) =>
          new Catalog(
            new Uuid(catalog.id),
            catalog.name,
            CatalogType.fromString(catalog.type),
            catalog.items.map(
              (item) =>
                new CatalogItem(
                  new Uuid(item.id),
                  item.name,
                  Money.create(
                    item.priceAmountInCents,
                    item.priceSuffix as MoneySufix,
                  ),
                ),
            ),
          ),
      ),
      seller.operators.map(
        (operator) =>
          new Operator(
            new Uuid(operator.id),
            operator.name,
            Email.create(operator.email),
          ),
      ),
      seller.assignments.map(
        (assignment) =>
          new Assignment(
            new Uuid(assignment.operatorId),
            new Uuid(assignment.catalogId),
            Role.fromString(assignment.role),
          ),
      ),
    );
  }
}
