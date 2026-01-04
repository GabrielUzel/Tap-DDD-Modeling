import { describe, it, expect, beforeEach, mock } from "bun:test";
import { CreateCatalogItemHandler } from "../../../application/commands/create-catalog-item.handler";
import { CreateCatalogItemCommand } from "../../../application/commands/dtos/create-catalog-item.command";
import { Operation } from "../../../domain/operation/operation.aggregate";
import { Seller } from "../../../domain/seller/seller.aggregate";
import { Catalog } from "../../../domain/seller/catalog.entity";
import { Uuid } from "../../../domain/@shared/interfaces/uuid";
import { Email } from "../../../domain/@shared/value-objects/email.value";
import { CatalogType } from "../../../domain/@shared/value-objects/catalog-type.value";

describe("CreateCatalogItemHandler", () => {
  const opRepoMock = { findById: mock() };
  const sellerRepoMock = { findById: mock(), save: mock() };

  const handler = new CreateCatalogItemHandler(
    opRepoMock as any,
    sellerRepoMock as any,
  );

  beforeEach(() => {
    opRepoMock.findById.mockReset();
    sellerRepoMock.findById.mockReset();
    sellerRepoMock.save.mockReset();
  });

  it("Should create catalog item successfully", async () => {
    const opId = Uuid.generate();
    const sellerId = Uuid.generate();
    const catalogId = Uuid.generate();

    const operation = Operation.create(opId, "Op");
    operation.addSeller(sellerId);

    const seller = Seller.create(sellerId, "Seller", Email.create("s@s.com"));
    seller.addCatalog(Catalog.create(catalogId, "Cat", CatalogType.GENERAL));

    const command = new CreateCatalogItemCommand(
      opId.getValue(),
      sellerId.getValue(),
      catalogId.getValue(),
      "New Item",
      1000,
      "BRL",
    );

    opRepoMock.findById.mockResolvedValue(operation);
    sellerRepoMock.findById.mockResolvedValue(seller);

    await handler.execute(command);

    expect(sellerRepoMock.save).toHaveBeenCalled();
    const savedSeller = sellerRepoMock.save.mock.calls[0][0] as Seller;

    const catalog = savedSeller.getCatalog(catalogId);
    expect(catalog.hasAnyItem()).toBeTrue();
  });

  it("Should throw Error if operation not found", async () => {
    const command = new CreateCatalogItemCommand(
      Uuid.generate().getValue(),
      Uuid.generate().getValue(),
      Uuid.generate().getValue(),
      "Item",
      100,
      "BRL",
    );
    opRepoMock.findById.mockResolvedValue(null);

    expect(handler.execute(command)).rejects.toThrow("Operation not found");
  });
});
