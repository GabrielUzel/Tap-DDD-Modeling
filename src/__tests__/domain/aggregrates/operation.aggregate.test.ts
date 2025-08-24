import { describe, it, expect, beforeEach } from "bun:test";
import { Operation } from "../../../domain/aggregates/operation.aggregate";
import { Uuid } from "../../../shared/uuid";
import { Catalog } from "../../../domain/entities/catalog.entity";
import { CatalogType } from "../../../domain/value-objects/catalog-type.value";
import { CatalogItem } from "../../../domain/entities/catalog-item.entity";
import { Money } from "../../../domain/value-objects/money.value";
import { Assignment } from "../../../domain/value-objects/assignment.value";
import { Operator } from "../../../domain/entities/operator.entity";
import { Email } from "../../../domain/value-objects/email.value";
import { Role } from "../../../domain/value-objects/role.value";
import { Sale } from "../../../domain/aggregates/sale.aggregate";

describe("Operation factory tests", () => {
  it("Should create operation with status planned", () => {  
    const operation = Operation.create(Uuid.generate());
    
    expect(operation).toBeInstanceOf(Operation);
    expect(operation.getStatus()).toBe("planned");
  });
});

describe("AddCatalog tests", () => {
  it("Should add catalog to operation successfully", () => {
    const operation = Operation.create(Uuid.generate());
    const catalog = Catalog.create(Uuid.generate(), "Valid name", new CatalogType("general"));
    
    operation.addCatalog(catalog);

    expect(operation.hasCatalog(catalog.getId())).toBeTrue();
  });

  it("Should throw error, catalog is already on catalog", () => {
    const operation = Operation.create(Uuid.generate());
    const catalog = Catalog.create(Uuid.generate(), "Valid name", new CatalogType("general"));
    
    operation.addCatalog(catalog);

    expect(() => operation.addCatalog(catalog)).toThrowError("Catalog already belongs to this operation");
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
    const operation = Operation.create(Uuid.generate());
    const catalog = Catalog.create(Uuid.generate(), "Valid name", new CatalogType("general"));
    const item = CatalogItem.create(Uuid.generate(), "Valid name", Money.create(10, "BRL"));
    
    operation.addCatalog(catalog);
    operation.addItemToCatalog(catalog.getId(), item);

    expect(catalog.hasAnyItem()).toBeTrue();
  });

  it("Should throw error, catalog is not found", () => {
    const operation = Operation.create(Uuid.generate());
    const catalog = Catalog.create(Uuid.generate(), "Valid name", new CatalogType("general"));
    const item = CatalogItem.create(Uuid.generate(), "Valid name", Money.create(10, "BRL"));
    
    operation.addCatalog(catalog);
    
    expect(() => operation.addItemToCatalog(Uuid.generate(), item)).toThrowError("Catalog not found");
  });
});

describe("Start operation tests", () => {    
  it("Should change operation status successfully", () => {
    const operation = Operation.create(Uuid.generate());
    const catalog = Catalog.create(Uuid.generate(), "Valid name", new CatalogType("general"));
    const catalogItem = CatalogItem.create(Uuid.generate(), "Item", Money.create(10, "BRL"));
    
    operation.addCatalog(catalog);
    operation.addItemToCatalog(catalog.getId(), catalogItem);
    operation.startOperation();

    expect(operation.getStatus()).toBe("on_going");
  });


  it("Should throw error, no catalogs registered", () => {
    const operation = Operation.create(Uuid.generate());

    expect(() => operation.startOperation()).toThrowError("No catalogs registered");
  });

  it("Should throw error, no catalogs with items", () => {
    const operation = Operation.create(Uuid.generate());
    const catalog = Catalog.create(Uuid.generate(), "Valid name", new CatalogType("general"));

    operation.addCatalog(catalog);

    expect(() => operation.startOperation()).toThrowError("At least one catalog must contain items to start the operation");
  });
});

describe("Assign operator tests", () => {
  it("Assignment created successfully", () => {
    const operation = Operation.create(Uuid.generate());
    const operator = Operator.create(Uuid.generate(), "Valid name", Email.create("valid_email@gmail.com"));
    const catalog = Catalog.create(Uuid.generate(), "Valid name", new CatalogType("general"));
    
    operation.addCatalog(catalog);
    operation.assignOperator(operator.getId(), catalog.getId(), new Role('cashier'));
  
    expect(operation.getAssignment(operator.getId(), catalog.getId())).toBeInstanceOf(Assignment);
  });

  it("Catalog does not belong to operation", () => {
    const operation = Operation.create(Uuid.generate());
    const operator = Operator.create(Uuid.generate(), "Valid name", Email.create("valid_email@gmail.com"));
    const catalog = Catalog.create(Uuid.generate(), "Valid name", new CatalogType("general"));

    expect(() => operation.assignOperator(operator.getId(), catalog.getId(), new Role("cashier"))).toThrowError("Catalog does not belong to this operation");
  });

  it("Operator already has the same role assigned to the same catalog", () => {
    const operation = Operation.create(Uuid.generate());
    const operator = Operator.create(Uuid.generate(), "Valid name", Email.create("valid_email@gmail.com"));
    const catalog = Catalog.create(Uuid.generate(), "Valid name", new CatalogType("general"));
    operation.addCatalog(catalog);
    operation.assignOperator(operator.getId(), catalog.getId(), new Role("cashier"));

    expect(() => operation.assignOperator(operator.getId(), catalog.getId(), new Role("cashier"))).toThrowError("Operator already assigned to this catalog");
  });
});

describe("Register sale tests", () => {
  let operation: Operation;
  let operator: Operator;
  let catalog: Catalog;
  let item: CatalogItem;
  let anotherItem: CatalogItem;

  beforeEach(() => {
    operation = Operation.create(Uuid.generate());
    operator = Operator.create(Uuid.generate(), "Valid Name", Email.create("valid_email@email.com"));
    catalog = Catalog.create(Uuid.generate(), "Camarote", new CatalogType("general"));
    item = CatalogItem.create(Uuid.generate(), "Item", Money.create(10, "BRL"));
    anotherItem = CatalogItem.create(Uuid.generate(), "Item 2", Money.create(20, "BRL"));
  });

  it("Sale registered successfully", () => {
    operation.addCatalog(catalog);
    operation.addItemToCatalog(catalog.getId(), item);
    operation.addItemToCatalog(catalog.getId(), anotherItem);
    operation.startOperation();
    operation.assignOperator(operator.getId(), catalog.getId(), new Role("cashier"));
    const sale = operation.registerSale(operator.getId(), catalog.getId(), [{ item, quantity: 1 }, { item: anotherItem, quantity: 2}]);

    expect(sale).toBeInstanceOf(Sale);
  });

  it("Should throw error, operation has not started", () => {
    expect(() => operation.registerSale(operator.getId(), catalog.getId(), [{ item, quantity: 1 }, { item: anotherItem, quantity: 2}])).toThrowError("Operation must be on_going to register a sale");
  });

  it("Should throw error, catalog does not belong to operation", () => {
    operation.addCatalog(catalog);
    operation.addItemToCatalog(catalog.getId(), item);
    operation.addItemToCatalog(catalog.getId(), anotherItem);
    operation.startOperation();
    operation.assignOperator(operator.getId(), catalog.getId(), new Role("cashier"));
    
    expect(() => operation.registerSale(operator.getId(), Uuid.generate(), [{ item, quantity: 1 }, { item: anotherItem, quantity: 2}])).toThrowError("Catalog does not belong to this operation");
  });

  it("Should throw error, operator is not assigned to this catalog", () => {
    operation.addCatalog(catalog);
    operation.addItemToCatalog(catalog.getId(), item);
    operation.addItemToCatalog(catalog.getId(), anotherItem);
    operation.startOperation();

    expect(() => operation.registerSale(operator.getId(), catalog.getId(), [{ item, quantity: 1 }, { item: anotherItem, quantity: 2}])).toThrowError("Operator is not assigned to this catalog");
  });

  it("Should throw error, no items provided for sale", () => {
    operation.addCatalog(catalog);
    operation.addItemToCatalog(catalog.getId(), item);
    operation.addItemToCatalog(catalog.getId(), anotherItem);
    operation.startOperation();
    operation.assignOperator(operator.getId(), catalog.getId(), new Role("cashier"));

    expect(() => operation.registerSale(operator.getId(), catalog.getId(), [])).toThrowError("Sale must contain at least one item");
  });
});