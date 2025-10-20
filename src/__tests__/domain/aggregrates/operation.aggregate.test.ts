import { describe, it, expect, beforeEach } from "bun:test";
import { Operation } from "../../../domain/aggregates/operation.aggregate";
import { Uuid } from "../../../shared/uuid";
import { Catalog } from "../../../domain/entities/catalog.entity";
import { CatalogType } from "../../../domain/value-objects/catalog-type.value";
import { CatalogItem } from "../../../domain/entities/catalog-item.entity";
import { SaleItem } from "../../../domain/value-objects/sale-item.value";
import { Money, type MoneySufix } from "../../../domain/value-objects/money.value";
import { Role } from "../../../domain/value-objects/role.value";
import { OperationSeller } from "../../../domain/entities/operation-seller.child-entity";
import { isLeft, isRight } from "../../../shared/either.protocol";

describe("Operation aggregate tests", () => {
  let operation: Operation;
  let sellerId: Uuid;
  let anotherSellerId: Uuid;
  let operatorId: Uuid;
  let anotherOperatorId: Uuid;
  let catalog: Catalog;
  let anotherCatalog: Catalog;
  let item: CatalogItem;
  let anotherItem: CatalogItem;

  beforeEach(() => {
    operation = Operation.create(Uuid.generate(), "Operation");
    sellerId = Uuid.generate();
    anotherSellerId = Uuid.generate();
    operatorId = Uuid.generate();
    anotherOperatorId = Uuid.generate();
    catalog = Catalog.create(Uuid.generate(), "Catálogo", new CatalogType("general"));
    anotherCatalog = Catalog.create(Uuid.generate(), "Another Catalog", new CatalogType("general"));
    item = CatalogItem.create(Uuid.generate(), "Item", Money.create(10, "BRL"));
    anotherItem = CatalogItem.create(Uuid.generate(), "Another Item", Money.create(15, "BRL"));
  });

  describe("Operation factory tests", () => {
    it("Should create operation with status planned", () => {  
      const operation = Operation.create(Uuid.generate(), "Operation");
      
      expect(operation).toBeInstanceOf(Operation);
      expect(operation.getStatus()).toBe("planned");
    });
  });

  describe("Add seller tests", () => {
    it("Should add seller to operation", () =>{
      operation.addSeller(sellerId);
      expect(operation.findSeller(sellerId)).toBeInstanceOf(OperationSeller);
    });

    it("Should throw exception, duplicate seller", () => {
      operation.addSeller(sellerId);
      expect(() => operation.addSeller(sellerId)).toThrowError("Seller already added to the operation");
    });

    it("Should throw error when adding catalog to non-existent seller", () => {
      expect(() => operation.addCatalogToSeller(sellerId, catalog)).toThrowError("Seller not found");
    });

    it("Should throw error when adding item to non-existent seller", () => {
      expect(() => operation.addItemToCatalogOfSeller(sellerId, catalog.getId(), item)).toThrowError("Seller not found");
    });

    it("Should throw error when adding operator to non-existent seller", () => {
      expect(() => operation.addOperatorToSeller(sellerId, operatorId)).toThrowError("Seller not found");
    });

    it("Should throw error when adding assignment to non-existent seller", () => {
      expect(() => operation.addAssignmentToSeller(sellerId, operatorId, catalog.getId(), new Role("cashier"))).toThrowError("Seller not found");
    });
  });

  describe("AddCatalog tests", () => {
    it("Should add catalog to operation successfully", () => {
      operation.addSeller(sellerId);
      operation.addCatalogToSeller(sellerId, catalog);

      expect(operation.findSeller(sellerId).getCatalogs()).toContain(catalog);
    });

    it("Should throw error, catalog is already on operation", () => {
      operation.addSeller(sellerId);
      operation.addCatalogToSeller(sellerId, catalog);

      expect(() => operation.addCatalogToSeller(sellerId, catalog)).toThrowError("Catalog already belongs to this operation");
    });
  });

  describe("Catalog item factory tests", () => {
    it("Should create catalog item successfully", () => {
      expect(() => CatalogItem.create(Uuid.generate(), "Valid name", Money.create(10, "BRL"))).not.toThrow();
    }); 
    
    it("Should throw error, item name is empty", () => {
      expect(() => CatalogItem.create(Uuid.generate(), " ", Money.create(10, "BRL"))).toThrowError("Name cannot be empty");
    });
  });

  describe("Add item to catalog tests", () => {
    it("Should add item to catalog successfully", () => {
      operation.addSeller(sellerId);
      operation.addCatalogToSeller(sellerId, catalog);
      operation.addItemToCatalogOfSeller(sellerId, catalog.getId(), item);

      expect(catalog.hasAnyItem()).toBeTrue();
    });

    it("Should throw error, catalog is not found", () => {
      operation.addSeller(sellerId);

      expect(() => operation.addItemToCatalogOfSeller(sellerId, Uuid.generate(), item)).toThrowError("Catalog not found");
    });
  });

  describe("Start operation tests", () => {    
    it("Should change operation status successfully", () => {
      operation.addSeller(sellerId);
      operation.addCatalogToSeller(sellerId, catalog);
      operation.addItemToCatalogOfSeller(sellerId, catalog.getId(), item);
      operation.addItemToCatalogOfSeller(sellerId, catalog.getId(), anotherItem);
      operation.startOperation();

      expect(operation.getStatus()).toBe("on_going");
    });


    it("Should throw error, no catalogs registered", () => {
      operation.addSeller(sellerId);

      expect(() => operation.startOperation()).toThrowError("No catalogs registered");
    });

    it("Should throw error, no catalogs with items", () => {
      operation.addSeller(sellerId);
      operation.addCatalogToSeller(sellerId, catalog);

      expect(() => operation.startOperation()).toThrowError("At least one catalog must contain items to start the operation");
    });
  });

  describe("Add operator tests", () => {
    it("Should add operator to seller sucessfully", () => {
      operation.addSeller(sellerId);
      operation.addOperatorToSeller(sellerId, operatorId);

      expect(operation.findSeller(sellerId).operatorIsInPool(operatorId)).toBeTrue();
    });

    it("Should throw exception, operator already in pool", () => {
      operation.addSeller(sellerId);
      operation.addOperatorToSeller(sellerId, operatorId);

      expect(() => operation.addOperatorToSeller(sellerId, operatorId)).toThrowError("Operator already in pool");
    });
  });

  describe("Assign operator tests", () => {
    it("Should create assignment successfully", () => {
      operation.addSeller(sellerId);
      operation.addCatalogToSeller(sellerId, catalog);
      operation.addOperatorToSeller(sellerId, operatorId);
      operation.addAssignmentToSeller(sellerId, operatorId, catalog.getId(), new Role("cashier"));

      expect(operation.findSeller(sellerId).isOperatorAlreadyAssigned(operatorId, catalog.getId())).toBeTrue();
    });

    it("Should throw exception, catalog does not belong to operation", () => {
      operation.addSeller(sellerId);
      operation.addCatalogToSeller(sellerId, catalog);
      operation.addOperatorToSeller(sellerId, operatorId);

      expect(() => operation.addAssignmentToSeller(sellerId, operatorId, Uuid.generate(), new Role("cashier"))).toThrowError("Catalog does not belong to this operation");
    });

    it("Should throw exception, operator already has the same role assigned to the same catalog", () => {
      operation.addSeller(sellerId);
      operation.addCatalogToSeller(sellerId, catalog);
      operation.addOperatorToSeller(sellerId, operatorId);
      operation.addAssignmentToSeller(sellerId, operatorId, catalog.getId(), new Role("cashier"));

      expect(() => operation.addAssignmentToSeller(sellerId, operatorId, catalog.getId(), new Role("cashier"))).toThrowError("Operator already assigned to this catalog");
    });
  });

  describe("Seller context isolation tests", () => {
    it("Should add catalog to both sellers and isolate them", () => {
      operation.addSeller(sellerId);
      operation.addSeller(anotherSellerId);

      operation.addCatalogToSeller(sellerId, catalog);
      operation.addCatalogToSeller(anotherSellerId, anotherCatalog);

      expect(operation.findSeller(sellerId).getCatalogs()).toContain(catalog);
      expect(operation.findSeller(anotherSellerId).getCatalogs()).toContain(anotherCatalog);
      expect(operation.findSeller(sellerId).getCatalogs()).not.toContain(anotherCatalog);
      expect(operation.findSeller(anotherSellerId).getCatalogs()).not.toContain(catalog);
    });

    it("Should add item to both sellers catalogs and isolate them", () => {
      operation.addSeller(sellerId);
      operation.addSeller(anotherSellerId);

      operation.addCatalogToSeller(sellerId, catalog);
      operation.addCatalogToSeller(anotherSellerId, anotherCatalog);

      operation.addItemToCatalogOfSeller(sellerId, catalog.getId(), item);
      operation.addItemToCatalogOfSeller(anotherSellerId, anotherCatalog.getId(), anotherItem);

      expect(operation.findSeller(sellerId).getCatalog(catalog.getId()).findItem(item.getId())).toBeTruthy();
      expect(operation.findSeller(anotherSellerId).getCatalog(anotherCatalog.getId()).findItem(anotherItem.getId())).toBeTruthy();
      expect(() => operation.findSeller(sellerId).getCatalog(catalog.getId()).findItem(anotherItem.getId())).toThrowError("Item not found");
      expect(() => operation.findSeller(anotherSellerId).getCatalog(anotherCatalog.getId()).findItem(item.getId())).toThrowError("Item not found");
    });

    it("Should add operator to both sellers and isolate them", () => {
      operation.addSeller(sellerId);
      operation.addSeller(anotherSellerId);

      operation.addOperatorToSeller(sellerId, operatorId);
      operation.addOperatorToSeller(anotherSellerId, anotherOperatorId);

      expect(operation.findSeller(sellerId).operatorIsInPool(operatorId)).toBeTrue();
      expect(operation.findSeller(anotherSellerId).operatorIsInPool(anotherOperatorId)).toBeTrue();
      expect(operation.findSeller(sellerId).operatorIsInPool(anotherOperatorId)).toBeFalse();
      expect(operation.findSeller(anotherSellerId).operatorIsInPool(operatorId)).toBeFalse();
    });

    it("Should add assignment to both sellers and isolate them", () => {
      operation.addSeller(sellerId);
      operation.addSeller(anotherSellerId);
      
      operation.addCatalogToSeller(sellerId, catalog);
      operation.addCatalogToSeller(anotherSellerId, anotherCatalog);

      operation.addOperatorToSeller(sellerId, operatorId);
      operation.addOperatorToSeller(anotherSellerId, anotherOperatorId);

      operation.addAssignmentToSeller(sellerId, operatorId, catalog.getId(), new Role("cashier"));
      operation.addAssignmentToSeller(anotherSellerId, anotherOperatorId, anotherCatalog.getId(), new Role("admin"));

      expect(operation.findSeller(sellerId).isOperatorAlreadyAssigned(operatorId, catalog.getId())).toBeTrue();
      expect(operation.findSeller(anotherSellerId).isOperatorAlreadyAssigned(anotherOperatorId, anotherCatalog.getId())).toBeTrue();
      expect(operation.findSeller(sellerId).isOperatorAlreadyAssigned(anotherOperatorId, catalog.getId())).toBeFalse();
      expect(operation.findSeller(anotherSellerId).isOperatorAlreadyAssigned(operatorId, anotherCatalog.getId())).toBeFalse();
    });
  });

  describe("Register sale validation tests", () => {
    it("Should validate register sale, sale can be registered", () => {
      operation.addSeller(sellerId);
      operation.addCatalogToSeller(sellerId, catalog);
      operation.addItemToCatalogOfSeller(sellerId, catalog.getId(), item);
      operation.addItemToCatalogOfSeller(sellerId, catalog.getId(), anotherItem);
      operation.addOperatorToSeller(sellerId, operatorId);
      operation.addAssignmentToSeller(sellerId, operatorId, catalog.getId(), new Role("cashier"));
      operation.startOperation();

      const moneySuffix = "BRL" as MoneySufix;
      const items = [
        new SaleItem(item.getId(), 1, new Money({ amount: 100, sufix: moneySuffix })),
        new SaleItem(anotherItem.getId(), 2, new Money({ amount: 200, sufix: moneySuffix }))
      ];

      const result = operation.registerSale(operatorId, sellerId, operatorId, catalog.getId(), items);

      expect(isRight(result)).toBeTrue();
    });

    it("Should not validate register sale, operation has not started", () => {
      operation.addSeller(sellerId);
      const moneySuffix = "BRL" as MoneySufix;
      const items = [
        new SaleItem(item.getId(), 1, new Money({ amount: 100, sufix: moneySuffix })),
        new SaleItem(anotherItem.getId(), 2, new Money({ amount: 200, sufix: moneySuffix }))
      ];

      const result = operation.registerSale(operatorId, sellerId, operatorId, catalog.getId(), items);

      expect(isLeft(result)).toBeTrue();
      expect(result.left?.message).toBe("Operation must be on_going to register a sale");
    });
  });
});
