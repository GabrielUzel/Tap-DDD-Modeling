import { describe, it, expect, beforeEach } from "bun:test";

import { Operation } from "../../../domain/operation/operation.aggregate";
import { Seller } from "../../../domain/seller/seller.aggregate";
import { Uuid } from "../../../domain/@shared/interfaces/uuid";
import { Email } from "../../../domain/@shared/value-objects/email.value";
import { Catalog } from "../../../domain/seller/catalog.entity";
import { CatalogItem } from "../../../domain/seller/catalog-item.entity";
import { Operator } from "../../../domain/seller/operator.entity";
import { CatalogType } from "../../../domain/@shared/value-objects/catalog-type.value";
import { Money } from "../../../domain/@shared/value-objects/money.value";
import { SaleItem } from "../../../domain/@shared/value-objects/sale-item.value";
import { Role } from "../../../domain/@shared/value-objects/role.value";
import { Sale } from "../../../domain/sale/sale.aggregate";

describe("Operation aggregate (atual)", () => {
  let operation: Operation;

  beforeEach(() => {
    operation = Operation.create(Uuid.generate(), "Operation");
  });

  it("Should create operation planned", () => {
    const op = Operation.create(Uuid.generate(), "Operation");

    expect(op.status.isPlanned()).toBeTrue();
  });

  it("Should throw error, name empty", () => {
    expect(() => Operation.create(Uuid.generate(), " ")).toThrowError(
      "Name cannot be empty",
    );
  });

  describe("addSeller()", () => {
    it("Should add seller id", () => {
      const sellerId = Uuid.generate();
      operation.addSeller(sellerId);

      expect(operation.hasSeller(sellerId)).toBeTrue();
    });

    it("Should throw error, duplicate seller", () => {
      const sellerId = Uuid.generate();
      operation.addSeller(sellerId);

      expect(() => operation.addSeller(sellerId)).toThrowError(
        "Seller already added to the operation",
      );
    });
  });

  describe("startOperation()", () => {
    it("Should throw error, no sellers provided", () => {
      expect(() => operation.startOperation([])).toThrowError(
        "Operation must have at least one seller",
      );
    });

    it("Should throw error, no seller has catalog with items", () => {
      const seller = Seller.create(
        Uuid.generate(),
        "Seller",
        Email.create("seller@gmail.com"),
      );

      operation.addSeller(seller.getId());

      expect(() => operation.startOperation([seller])).toThrowError(
        "Operation must have at least one seller with a catalog containing items",
      );
    });

    it("Should start operation when at least one seller has catalog with items", () => {
      const seller = Seller.create(
        Uuid.generate(),
        "Seller",
        Email.create("seller@gmail.com"),
      );

      const catalog = Catalog.create(
        Uuid.generate(),
        "Catálogo",
        CatalogType.fromString("general"),
      );

      const item = CatalogItem.create(
        Uuid.generate(),
        "Item",
        Money.create(10, "BRL"),
      );

      seller.addCatalog(catalog);
      seller.addItemToCatalog(catalog.getId(), item);

      operation.addSeller(seller.getId());
      operation.startOperation([seller]);

      expect(operation.status.isOnGoing()).toBeTrue();
    });

    it("Should throw error, only planned can be started", () => {
      const seller = Seller.create(
        Uuid.generate(),
        "Seller",
        Email.create("seller@gmail.com"),
      );

      const catalog = Catalog.create(
        Uuid.generate(),
        "Catálogo",
        CatalogType.fromString("general"),
      );

      seller.addCatalog(catalog);

      seller.addItemToCatalog(
        catalog.getId(),
        CatalogItem.create(Uuid.generate(), "Item", Money.create(10, "BRL")),
      );

      operation.addSeller(seller.getId());
      operation.startOperation([seller]);

      expect(() => operation.startOperation([seller])).toThrowError(
        "Only planned operations can be started",
      );
    });
  });

  describe("registerSale()", () => {
    it("Should throw error if operation not on_going", () => {
      const seller = Seller.create(
        Uuid.generate(),
        "Seller",
        Email.create("seller@gmail.com"),
      );

      expect(() =>
        operation.registerSale(
          seller,
          Uuid.generate(),
          Uuid.generate(),
          [],
          Uuid.generate(),
        ),
      ).toThrowError("Operation must be on_going to register a sale");
    });

    it("Should throw error if seller does not belong to operation", () => {
      const seller = Seller.create(
        Uuid.generate(),
        "Seller",
        Email.create("seller@gmail.com"),
      );

      const catalog = Catalog.create(
        Uuid.generate(),
        "Catálogo",
        CatalogType.fromString("general"),
      );

      seller.addCatalog(catalog);

      seller.addItemToCatalog(
        catalog.getId(),
        CatalogItem.create(Uuid.generate(), "Item", Money.create(10, "BRL")),
      );

      operation.startOperation([seller]);

      expect(() =>
        operation.registerSale(
          seller,
          Uuid.generate(),
          catalog.getId(),
          [],
          Uuid.generate(),
        ),
      ).toThrowError("Seller does not belong to this operation");
    });

    it("Should register sale when seller allows it", () => {
      const seller = Seller.create(
        Uuid.generate(),
        "Seller",
        Email.create("seller@gmail.com"),
      );

      const catalog = Catalog.create(
        Uuid.generate(),
        "Catálogo",
        CatalogType.fromString("general"),
      );

      const item = CatalogItem.create(
        Uuid.generate(),
        "Item",
        Money.create(10, "BRL"),
      );

      const operator = Operator.create(
        Uuid.generate(),
        "Operator",
        Email.create("operator@gmail.com"),
      );

      seller.addCatalog(catalog);
      seller.addItemToCatalog(catalog.getId(), item);

      seller.addOperatorToPool(operator);
      seller.assignOperator(operator.getId(), catalog.getId(), Role.CASHIER);

      operation.addSeller(seller.getId());
      operation.startOperation([seller]);

      const saleItems = [
        new SaleItem(item.getId(), 1, Money.create(10, "BRL")),
      ];

      const sale = operation.registerSale(
        seller,
        operator.getId(),
        catalog.getId(),
        saleItems,
        Uuid.generate(),
      );

      expect(sale).toBeInstanceOf(Sale);
    });
  });
});
