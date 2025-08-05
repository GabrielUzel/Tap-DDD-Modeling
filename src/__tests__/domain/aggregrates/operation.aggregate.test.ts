import { describe, it, expect, beforeEach } from "bun:test";
import { Operation } from "../../../domain/operation/operation.aggregate";
import { Uuid } from "../../../shared/uuid";
import { Catalog } from "../../../domain/operation/entities/catalog.entity";
import { CatalogType } from "../../../domain/operation/value-objects/catalog-type.value";
import { CatalogItem } from "../../../domain/operation/entities/catalog-item.entity";
import { Money } from "../../../domain/shared/money.value";
import { Assignment } from "../../../domain/operation/value-objects/assignment.value";
import { Operator } from "../../../domain/seller/entities/operator.entity";
import { Email } from "../../../domain/seller/value-objects/email.value";
import { Role } from "../../../domain/operation/value-objects/role.value";
import { SaleItem } from "../../../domain/shared/sale-item.value";
import { Sale } from "../../../domain/sale/sale.aggregate";

describe("Testes operation factory", () => {
  it("Id passado é inválido", () => {
    expect(() => Operation.create(new Uuid("Invalid id"))).toThrowError("Invalid uuid format");
  });

  it("Operation criada com status planned", () => {  
    const operation = Operation.create(Uuid.generate());
    
    expect(operation).toBeInstanceOf(Operation);
    expect(operation.getStatus()).toBe("planned");
  });
});

describe("Testes addCatalog", () => {
  it("Cria catalog com sucesso", () => {
    const operation = Operation.create(Uuid.generate());
    const catalog = Catalog.create(Uuid.generate(), "Valid name", new CatalogType("camarote"));
    operation.addCatalog(catalog);

    expect(operation.hasCatalog(catalog.getId())).toBeTrue();
  });

  it("Catalog já existe na operation", () => {
    const operation = Operation.create(Uuid.generate());
    const catalog = Catalog.create(Uuid.generate(), "Valid name", new CatalogType("camarote"));
    operation.addCatalog(catalog);

    expect(() => operation.addCatalog(catalog)).toThrowError("Catalog already belongs to this operation");
  });
});

describe("Testes catalog item factory", () => {
  it("Nome do item está vazio", () => {
    expect(() => CatalogItem.create(Uuid.generate(), " ", Money.create(10, "BRL"))).toThrowError("Name cannot be empty");
  });

  it("Preço está menor que 0", () => {
    expect(() => CatalogItem.create(Uuid.generate(), "Valid name", Money.create(-10, "BRL"))).toThrowError("Value must be greater than zero");
  });
});

describe("Testes addItemToCatalog", () => {
  it("Catálogo não foi encontrado", () => {
    const operation = Operation.create(Uuid.generate());
    const catalog = Catalog.create(Uuid.generate(), "Valid name", new CatalogType("camarote"));
    const item = CatalogItem.create(Uuid.generate(), "Valid name", Money.create(10, "BRL"));
    operation.addCatalog(catalog);
    
    expect(() => operation.addItemToCatalog(Uuid.generate(), item)).toThrowError("Catalog not found");
  });

  it("Item adicionado ao catalog com sucesso", () => {
    const operation = Operation.create(Uuid.generate());
    const catalog = Catalog.create(Uuid.generate(), "Valid name", new CatalogType("camarote"));
    const item = CatalogItem.create(Uuid.generate(), "Valid name", Money.create(10, "BRL"));
    operation.addCatalog(catalog);
    operation.addItemToCatalog(catalog.getId(), item);

    expect(catalog.hasAnyItem()).toBeTrue();
  });
});

describe("Testes start operation", () => {    
  it("Operation não tem catalog registrado", () => {
    const operation = Operation.create(Uuid.generate());

    expect(() => operation.startOperation()).toThrowError("No catalogs registered");
  });

  it("Não há nenhum catalog com ao menos 1 item", () => {
    const operation = Operation.create(Uuid.generate());
    const catalog = Catalog.create(Uuid.generate(), "Valid name", new CatalogType("camarote"));
    operation.addCatalog(catalog);

    expect(() => operation.startOperation()).toThrowError("At least one catalog must contain items to start the operation");
  });

  it("Muda status da operation para on_going com sucesso", () => {
    const operation = Operation.create(Uuid.generate());
    const catalog = Catalog.create(Uuid.generate(), "Valid name", new CatalogType("camarote"));
    const catalogItem = CatalogItem.create(Uuid.generate(), "Item", Money.create(10, "BRL"));
    operation.addCatalog(catalog);
    operation.addItemToCatalog(catalog.getId(), catalogItem);

    operation.startOperation();

    expect(operation.getStatus()).toBe("on_going");
  });
});

describe("Testes assignment factory", () => {
  it("Id do operator vazio", () => {
    expect(() => Assignment.create(undefined as any, Uuid.generate(), new Role("cashier"))).toThrowError("OperatorId cannot be empty");
  });

  it("Id do catalog vazio", () => {
    expect(() => Assignment.create(Uuid.generate(), undefined as any, new Role("cashier"))).toThrowError("CatalogId cannot be empty");
  });

  it("Role vazia", () => {
    expect(() => Assignment.create(Uuid.generate(), Uuid.generate(), undefined as any)).toThrowError("Role cannot be empty");
  });

  it("Assignment criado com sucesso", () => {
    const assignment = Assignment.create(Uuid.generate(), Uuid.generate(), new Role("cashier"));
    expect(assignment).toBeInstanceOf(Assignment);
  });
});

describe("Testes assign operator", () => {
  it("Catalog não pertence a operation", () => {
    const operation = Operation.create(Uuid.generate());
    const operator = Operator.create(Uuid.generate(), "Valid name", Email.create("valid_email@gmail.com"));
    const catalog = Catalog.create(Uuid.generate(), "Valid name", new CatalogType("camarote"));

    expect(() => operation.assignOperator(operator.getId(), catalog.getId(), new Role("cashier"))).toThrowError("Catalog does not belong to this operation");
  });

  it("Operator já tem a mesma role associada ao mesmo catalog", () => {
    const operation = Operation.create(Uuid.generate());
    const operator = Operator.create(Uuid.generate(), "Valid name", Email.create("valid_email@gmail.com"));
    const catalog = Catalog.create(Uuid.generate(), "Valid name", new CatalogType("camarote"));
    operation.addCatalog(catalog);
    operation.assignOperator(operator.getId(), catalog.getId(), new Role("cashier"));

    expect(() => operation.assignOperator(operator.getId(), catalog.getId(), new Role("cashier"))).toThrowError("Operator already assigned to this catalog");
  });

  it("Assignment criado com sucesso", () => {
    const operation = Operation.create(Uuid.generate());
    const operator = Operator.create(Uuid.generate(), "Valid name", Email.create("valid_email@gmail.com"));
    const catalog = Catalog.create(Uuid.generate(), "Valid name", new CatalogType("camarote"));
    operation.addCatalog(catalog);
    operation.assignOperator(operator.getId(), catalog.getId(), new Role('cashier'));
  
    expect(operation.getAssignment(operator.getId(), catalog.getId())).toBeInstanceOf(Assignment);
  });
});

describe("Testes sale item factory", () => {
  it("Quantidade é menor que 0", () => {
    expect(() => SaleItem.create(Uuid.generate(), 0, Money.create(10, "BRL"))).toThrowError("Quantity must be greater than one");
  });

  it("Quantidade é maior que 100", () => {
    expect(() => SaleItem.create(Uuid.generate(), 101, Money.create(10, "BRL"))).toThrowError("Quantity must be lower than one hundred");
  });

  it("Sale item criado com sucesso", () => {
    const saleItem = SaleItem.create(Uuid.generate(), 1, Money.create(10, "BRL"));
    expect(saleItem).toBeInstanceOf(SaleItem);
  });
});

describe("Testes register sale", () => {
  let operation: Operation;
  let operator: Operator;
  let catalog: Catalog;
  let item: CatalogItem;
  let anotherItem: CatalogItem;

  beforeEach(() => {
    operation = Operation.create(Uuid.generate());
    operator = Operator.create(Uuid.generate(), "Valid Name", Email.create("valid_email@email.com"));
    catalog = Catalog.create(Uuid.generate(), "Camarote", new CatalogType("camarote"));
    item = CatalogItem.create(Uuid.generate(), "Item", Money.create(10, "BRL"));
    anotherItem = CatalogItem.create(Uuid.generate(), "Item 2", Money.create(20, "BRL"));

    catalog.addItem(item);
    catalog.addItem(anotherItem);
    operation.addCatalog(catalog);
  });

  it("Operation não está iniciada", () => {
    expect(() => operation.registerSale(operator.getId(), catalog.getId(), [{ item, quantity: 1 }, { item: anotherItem, quantity: 2}])).toThrowError("Operation must be on_going to register a sale");
  });

  it("Catalog não está registrada na operation", () => {
    operation.startOperation();

    expect(() => operation.registerSale(operator.getId(), Uuid.generate(), [{ item, quantity: 1 }, { item: anotherItem, quantity: 2}])).toThrowError("Catalog does not belong to this operation");
  });

  it("Operator não está registrado no catalog", () => {
    operation.startOperation();

    expect(() => operation.registerSale(operator.getId(), catalog.getId(), [{ item, quantity: 1 }, { item: anotherItem, quantity: 2}])).toThrowError("Operator is not assigned to this catalog");
  });

  it("Não há items para sale", () => {
    operation.assignOperator(operator.getId(), catalog.getId(), new Role("cashier"));
    operation.startOperation();

    expect(() => operation.registerSale(operator.getId(), catalog.getId(), [])).toThrowError("No items provided for sale");
  });

  it("Sale registrada com sucesso", () => {
    operation.assignOperator(operator.getId(), catalog.getId(), new Role("cashier"));
    operation.startOperation();
    const sale = operation.registerSale(operator.getId(), catalog.getId(), [{ item, quantity: 1 }, { item: anotherItem, quantity: 2}]);

    expect(sale).toBeInstanceOf(Sale);
  });
});