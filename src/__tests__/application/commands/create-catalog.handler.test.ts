import { describe, it, expect, beforeEach, mock } from "bun:test";
import { NotFoundException } from "@nestjs/common";
import { CreateCatalogHandler } from "../../../application/commands/create-catalog.handler";
import { CreateCatalogCommand } from "../../../application/commands/dtos/create-catalog.command";
import { Operation } from "../../../domain/operation/operation.aggregate";
import { Seller } from "../../../domain/seller/seller.aggregate";
import { Uuid } from "../../../domain/@shared/interfaces/uuid";
import { Email } from "../../../domain/@shared/value-objects/email.value";

describe("CreateCatalogHandler", () => {
  const opRepoMock = { findById: mock() };
  const sellerRepoMock = { findById: mock(), save: mock() };

  const handler = new CreateCatalogHandler(
    opRepoMock as any,
    sellerRepoMock as any,
  );

  beforeEach(() => {
    opRepoMock.findById.mockReset();
    sellerRepoMock.findById.mockReset();
    sellerRepoMock.save.mockReset();
  });

  it("Should create catalog successfully", async () => {
    const opId = Uuid.generate();
    const sellerId = Uuid.generate();

    const operation = Operation.create(opId, "Op");
    operation.addSeller(sellerId);

    const seller = Seller.create(sellerId, "Seller", Email.create("s@s.com"));

    const command = new CreateCatalogCommand(
      opId.getValue(),
      sellerId.getValue(),
      "My Catalog",
      "general",
    );

    opRepoMock.findById.mockResolvedValue(operation);
    sellerRepoMock.findById.mockResolvedValue(seller);

    const result = await handler.execute(command);

    expect(sellerRepoMock.save).toHaveBeenCalled();
    const savedSeller = sellerRepoMock.save.mock.calls[0][0] as Seller;

    expect(savedSeller.catalogs.length).toBe(1);
    expect(savedSeller.catalogs[0].name).toBe("My Catalog");
    expect(result.catalogId).toBeDefined();
  });
});
