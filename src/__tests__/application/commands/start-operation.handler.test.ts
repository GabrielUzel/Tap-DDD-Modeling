import { describe, it, expect, beforeEach, mock } from "bun:test";
import { NotFoundException } from "@nestjs/common";
import { StartOperationHandler } from "../../../application/commands/start-operation.handler";
import { StartOperationCommand } from "../../../application/commands/dtos/start-operation.command";
import { Operation } from "../../../domain/operation/operation.aggregate";
import { Seller } from "../../../domain/seller/seller.aggregate";
import { Catalog } from "../../../domain/seller/catalog.entity";
import { CatalogItem } from "../../../domain/seller/catalog-item.entity";
import { Uuid } from "../../../domain/@shared/interfaces/uuid";
import { Email } from "../../../domain/@shared/value-objects/email.value";
import { Money } from "../../../domain/@shared/value-objects/money.value";
import { CatalogType } from "../../../domain/@shared/value-objects/catalog-type.value";

describe("StartOperationHandler", () => {
  const opRepoMock = { findById: mock(), save: mock() };
  const sellerRepoMock = { findMany: mock() };

  const handler = new StartOperationHandler(
    opRepoMock as any,
    sellerRepoMock as any,
  );

  beforeEach(() => {
    opRepoMock.findById.mockReset();
    opRepoMock.save.mockReset();
    sellerRepoMock.findMany.mockReset();
  });

  it("Should start operation successfully", async () => {
    const opId = Uuid.generate();
    const sellerId = Uuid.generate();
    const catalogId = Uuid.generate();
    const operation = Operation.create(opId, "Op Test");
    operation.addSeller(sellerId);
    const seller = Seller.create(sellerId, "Seller", Email.create("s@s.com"));
    const catalog = Catalog.create(catalogId, "Cat", CatalogType.GENERAL);

    const item = CatalogItem.create(
      Uuid.generate(),
      "Item",
      Money.create(100, "BRL"),
    );

    catalog.addItem(item);
    seller.addCatalog(catalog);
    const command = new StartOperationCommand(opId.getValue());
    opRepoMock.findById.mockResolvedValue(operation);
    sellerRepoMock.findMany.mockResolvedValue([seller]);
    const result = await handler.execute(command);

    expect(opRepoMock.save).toHaveBeenCalled();
    const savedOp = opRepoMock.save.mock.calls[0][0] as Operation;

    expect(savedOp.status.isOnGoing()).toBeTrue();
    expect(result.operationId).toBe(opId.getValue());
  });

  it("Should throw NotFoundException if operation not found", async () => {
    const command = new StartOperationCommand(Uuid.generate().getValue());
    opRepoMock.findById.mockResolvedValue(null);

    expect(handler.execute(command)).rejects.toThrow(NotFoundException);
    expect(opRepoMock.save).not.toHaveBeenCalled();
  });

  it("Should propagate domain error if no seller has items", async () => {
    const opId = Uuid.generate();
    const sellerId = Uuid.generate();
    const operation = Operation.create(opId, "Op Test");
    operation.addSeller(sellerId);
    const seller = Seller.create(sellerId, "Seller", Email.create("s@s.com"));
    const command = new StartOperationCommand(opId.getValue());

    opRepoMock.findById.mockResolvedValue(operation);
    sellerRepoMock.findMany.mockResolvedValue([seller]);

    expect(handler.execute(command)).rejects.toThrow();
    expect(opRepoMock.save).not.toHaveBeenCalled();
  });
});
