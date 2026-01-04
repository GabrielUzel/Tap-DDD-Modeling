import { describe, it, expect, beforeEach, mock } from "bun:test";
import { NotFoundException } from "@nestjs/common";
import { UpdateCatalogHandler } from "../../../application/commands/update-catalog.handler";
import { UpdateCatalogCommand } from "../../../application/commands/dtos/update-catalog.command";
import { Seller } from "../../../domain/seller/seller.aggregate";
import { Catalog } from "../../../domain/seller/catalog.entity";
import { Uuid } from "../../../domain/@shared/interfaces/uuid";
import { Email } from "../../../domain/@shared/value-objects/email.value";
import { CatalogType } from "../../../domain/@shared/value-objects/catalog-type.value";

describe("UpdateCatalogHandler", () => {
  const sellerRepoMock = { findById: mock(), save: mock() };
  const handler = new UpdateCatalogHandler(sellerRepoMock as any);

  beforeEach(() => {
    sellerRepoMock.findById.mockReset();
    sellerRepoMock.save.mockReset();
  });

  it("Should update catalog name and type successfully", async () => {
    const sellerId = Uuid.generate();
    const catalogId = Uuid.generate();

    const seller = Seller.create(sellerId, "Seller", Email.create("s@s.com"));
    const catalog = Catalog.create(catalogId, "Old Name", CatalogType.GENERAL);
    seller.addCatalog(catalog);

    const command = new UpdateCatalogCommand(
      sellerId.getValue(),
      catalogId.getValue(),
      "New Name",
      "lounge",
    );

    sellerRepoMock.findById.mockResolvedValue(seller);
    await handler.execute(command);
    expect(sellerRepoMock.save).toHaveBeenCalled();
    const savedSeller = sellerRepoMock.save.mock.calls[0][0] as Seller;
    const updatedCatalog = savedSeller.getCatalog(catalogId);

    expect(updatedCatalog.name).toBe("New Name");
    expect(updatedCatalog.type.isLounge()).toBeTrue();
  });

  it("Should throw NotFoundException if seller not found", async () => {
    const command = new UpdateCatalogCommand(
      Uuid.generate().getValue(),
      Uuid.generate().getValue(),
      "Name",
      "general",
    );

    sellerRepoMock.findById.mockResolvedValue(null);

    expect(handler.execute(command)).rejects.toThrow(NotFoundException);
    expect(sellerRepoMock.save).not.toHaveBeenCalled();
  });
});
