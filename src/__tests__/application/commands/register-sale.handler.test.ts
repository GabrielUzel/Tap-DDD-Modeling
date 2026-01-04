import { describe, it, expect, beforeEach, mock } from "bun:test";
import { NotFoundException } from "@nestjs/common";
import { RegisterSaleHandler } from "../../../application/commands/register-sale.handler";
import { RegisterSaleCommand } from "../../../application/commands/dtos/register-sale.command";
import { Operation } from "../../../domain/operation/operation.aggregate";
import { Seller } from "../../../domain/seller/seller.aggregate";
import { Catalog } from "../../../domain/seller/catalog.entity";
import { Operator } from "../../../domain/seller/operator.entity";
import { CatalogItem } from "../../../domain/seller/catalog-item.entity";
import { Uuid } from "../../../domain/@shared/interfaces/uuid";
import { Email } from "../../../domain/@shared/value-objects/email.value";
import { Money } from "../../../domain/@shared/value-objects/money.value";
import { CatalogType } from "../../../domain/@shared/value-objects/catalog-type.value";
import { Role } from "../../../domain/@shared/value-objects/role.value";
import { Sale } from "../../../domain/sale/sale.aggregate";

describe("RegisterSaleHandler", () => {
  const opRepoMock = { findById: mock() };
  const sellerRepoMock = { findById: mock() };
  const saleRepoMock = { save: mock() };

  const handler = new RegisterSaleHandler(
    opRepoMock as any,
    sellerRepoMock as any,
    saleRepoMock as any,
  );

  beforeEach(() => {
    opRepoMock.findById.mockReset();
    sellerRepoMock.findById.mockReset();
    saleRepoMock.save.mockReset();
  });

  it("Should register sale successfully", async () => {
    const opId = Uuid.generate();
    const sellerId = Uuid.generate();
    const catalogId = Uuid.generate();
    const itemId = Uuid.generate();
    const operatorId = Uuid.generate();
    const ticketId = Uuid.generate();
    const seller = Seller.create(sellerId, "Seller", Email.create("s@s.com"));
    const catalog = Catalog.create(catalogId, "Cat", CatalogType.GENERAL);
    const item = CatalogItem.create(itemId, "Item", Money.create(100, "BRL"));
    const operator = Operator.create(
      operatorId,
      "Op",
      Email.create("op@op.com"),
    );

    catalog.addItem(item);
    seller.addCatalog(catalog);
    seller.addOperatorToPool(operator);
    seller.assignOperator(operatorId, catalogId, Role.CASHIER);

    const operation = Operation.create(opId, "Op");
    operation.addSeller(sellerId);
    operation.startOperation([seller]);

    const command = new RegisterSaleCommand(
      opId.getValue(),
      sellerId.getValue(),
      operatorId.getValue(),
      catalogId.getValue(),
      [{ itemId: itemId.getValue(), quantity: 1 }],
      ticketId.getValue(),
    );

    opRepoMock.findById.mockResolvedValue(operation);
    sellerRepoMock.findById.mockResolvedValue(seller);

    const result = await handler.execute(command);

    expect(saleRepoMock.save).toHaveBeenCalled();
    const savedSale = saleRepoMock.save.mock.calls[0][0] as Sale;

    expect(savedSale.totalAmountInCents).toBe(100);
    expect(result.saleId).toBeDefined();
  });

  it("Should throw error if Operation is not ON_GOING", async () => {
    const opId = Uuid.generate();
    const operation = Operation.create(opId, "Op");

    const command = new RegisterSaleCommand(
      opId.getValue(),
      Uuid.generate().getValue(),
      Uuid.generate().getValue(),
      Uuid.generate().getValue(),
      [],
      Uuid.generate().getValue(),
    );

    opRepoMock.findById.mockResolvedValue(operation);
    expect(handler.execute(command)).rejects.toThrow();
  });
});
