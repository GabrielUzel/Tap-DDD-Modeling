import { describe, it, expect, beforeEach } from "bun:test";

import { Seller } from "../../../domain/seller/seller.aggregate";
import { Uuid } from "../../../domain/@shared/interfaces/uuid";
import { Email } from "../../../domain/@shared/value-objects/email.value";
import { Catalog } from "../../../domain/seller/catalog.entity";
import { CatalogItem } from "../../../domain/seller/catalog-item.entity";
import { Operator } from "../../../domain/seller/operator.entity";
import { CatalogType } from "../../../domain/@shared/value-objects/catalog-type.value";
import { Money } from "../../../domain/@shared/value-objects/money.value";
import { Role } from "../../../domain/@shared/value-objects/role.value";

describe("Seller aggregate (atual)", () => {
  let seller: Seller;

  beforeEach(() => {
    seller = Seller.create(
      Uuid.generate(),
      "Valid name",
      Email.create("valid_email@gmail.com"),
    );
  });

  describe("factory", () => {
    it("Should create seller", () => {
      expect(seller).toBeInstanceOf(Seller);
    });

    it("Should throw error, name is empty", () => {
      expect(() =>
        Seller.create(
          Uuid.generate(),
          " ",
          Email.create("valid_email@gmail.com"),
        ),
      ).toThrowError("Name cannot be empty");
    });

    it("Should throw error, name is too long", () => {
      const tooLongName = "A".repeat(101);

      expect(() =>
        Seller.create(
          Uuid.generate(),
          tooLongName,
          Email.create("valid_email@gmail.com"),
        ),
      ).toThrowError("Name is too long");
    });

    it("Should throw error, email is invalid", () => {
      expect(() =>
        Seller.create(Uuid.generate(), "Valid name", Email.create("invalid")),
      ).toThrowError("Email format invalid");
    });
  });

  describe("catalogs", () => {
    it("Should add catalog", () => {
      const catalog = Catalog.create(
        Uuid.generate(),
        "Catálogo",
        CatalogType.fromString("general"),
      );

      seller.addCatalog(catalog);

      expect(seller.hasCatalog(catalog.getId())).toBeTrue();
      expect(seller.getCatalog(catalog.getId())).toBe(catalog);
    });

    it("Should throw error, duplicate catalog", () => {
      const catalog = Catalog.create(
        Uuid.generate(),
        "Catálogo",
        CatalogType.fromString("general"),
      );

      seller.addCatalog(catalog);

      expect(() => seller.addCatalog(catalog)).toThrowError(
        "Catalog already belongs to this seller",
      );
    });

    it("Should throw error, getCatalog not found", () => {
      expect(() => seller.getCatalog(Uuid.generate())).toThrowError(
        "Catalog not found",
      );
    });

    it("Should add and remove item from catalog", () => {
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

      expect(seller.hasCatalogWithItems()).toBeTrue();

      seller.removeItemFromCatalog(catalog.getId(), item.getId());
      expect(seller.hasCatalogWithItems()).toBeFalse();
    });
  });

  describe("operators pool", () => {
    it("Should add operator to pool", () => {
      const operator = Operator.create(
        Uuid.generate(),
        "Operator",
        Email.create("operator@gmail.com"),
      );

      seller.addOperatorToPool(operator);

      expect(seller.operatorIsInPool(operator.getId())).toBeTrue();
    });

    it("Should throw error, operator already in pool", () => {
      const operator = Operator.create(
        Uuid.generate(),
        "Operator",
        Email.create("operator@gmail.com"),
      );

      seller.addOperatorToPool(operator);

      expect(() => seller.addOperatorToPool(operator)).toThrowError(
        "Operator already in pool",
      );
    });
  });

  describe("assignments / register sale", () => {
    it("Should assign operator to catalog", () => {
      const catalog = Catalog.create(
        Uuid.generate(),
        "Catálogo",
        CatalogType.fromString("general"),
      );

      seller.addCatalog(catalog);

      const operator = Operator.create(
        Uuid.generate(),
        "Operator",
        Email.create("operator@gmail.com"),
      );

      seller.addOperatorToPool(operator);
      seller.assignOperator(operator.getId(), catalog.getId(), Role.CASHIER);

      expect(
        seller.isOperatorAlreadyAssigned(operator.getId(), catalog.getId()),
      ).toBeTrue();
    });

    it("Should throw error, operator not in pool", () => {
      const catalog = Catalog.create(
        Uuid.generate(),
        "Catálogo",
        CatalogType.fromString("general"),
      );

      seller.addCatalog(catalog);

      expect(() =>
        seller.assignOperator(Uuid.generate(), catalog.getId(), Role.CASHIER),
      ).toThrowError("Operator is not in the pool");
    });

    it("Should throw error, catalog does not belong to seller", () => {
      const operator = Operator.create(
        Uuid.generate(),
        "Operator",
        Email.create("operator@gmail.com"),
      );

      seller.addOperatorToPool(operator);

      expect(() =>
        seller.assignOperator(operator.getId(), Uuid.generate(), Role.CASHIER),
      ).toThrowError("Catalog does not belong to this seller");
    });

    it("Should throw error, operator already assigned to same catalog", () => {
      const catalog = Catalog.create(
        Uuid.generate(),
        "Catálogo",
        CatalogType.fromString("general"),
      );

      seller.addCatalog(catalog);

      const operator = Operator.create(
        Uuid.generate(),
        "Operator",
        Email.create("operator@gmail.com"),
      );

      seller.addOperatorToPool(operator);
      seller.assignOperator(operator.getId(), catalog.getId(), Role.CASHIER);

      expect(() =>
        seller.assignOperator(operator.getId(), catalog.getId(), Role.CASHIER),
      ).toThrowError("Operator already assigned to this catalog");
    });

    it("assertCanRegisterSale should throw: catalog not found", () => {
      const operatorId = Uuid.generate();

      expect(() =>
        seller.assertCanRegisterSale(operatorId, Uuid.generate()),
      ).toThrowError("Catalog not found");
    });

    it("assertCanRegisterSale should throw: operator not in pool", () => {
      const catalog = Catalog.create(
        Uuid.generate(),
        "Catálogo",
        CatalogType.fromString("general"),
      );

      seller.addCatalog(catalog);

      expect(() =>
        seller.assertCanRegisterSale(Uuid.generate(), catalog.getId()),
      ).toThrowError("Operator not in pool");
    });

    it("assertCanRegisterSale should throw: assignment not found", () => {
      const catalog = Catalog.create(
        Uuid.generate(),
        "Catálogo",
        CatalogType.fromString("general"),
      );

      seller.addCatalog(catalog);

      const operator = Operator.create(
        Uuid.generate(),
        "Operator",
        Email.create("operator@gmail.com"),
      );

      seller.addOperatorToPool(operator);

      expect(() =>
        seller.assertCanRegisterSale(operator.getId(), catalog.getId()),
      ).toThrowError("Assignment not found");
    });

    it("assertCanRegisterSale should pass when operator assigned with cashier role", () => {
      const catalog = Catalog.create(
        Uuid.generate(),
        "Catálogo",
        CatalogType.fromString("general"),
      );

      seller.addCatalog(catalog);

      const operator = Operator.create(
        Uuid.generate(),
        "Operator",
        Email.create("operator@gmail.com"),
      );

      seller.addOperatorToPool(operator);
      seller.assignOperator(operator.getId(), catalog.getId(), Role.CASHIER);

      expect(() =>
        seller.assertCanRegisterSale(operator.getId(), catalog.getId()),
      ).not.toThrow();
    });
  });
});
