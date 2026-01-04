import { describe, it, expect, beforeEach, mock } from "bun:test";
import { NotFoundException } from "@nestjs/common";
import { RemoveCatalogItemFromCatalogHandler } from "../../../application/commands/remove-catalog-item-from-catalog.handler";
import { RemoveCatalogItemFromCatalogCommand } from "../../../application/commands/dtos/remove-catalog-item-from-catalog.command";
import { Seller } from "../../../domain/seller/seller.aggregate";
import { Catalog } from "../../../domain/seller/catalog.entity";
import { CatalogItem } from "../../../domain/seller/catalog-item.entity";
import { Uuid } from "../../../domain/@shared/interfaces/uuid";
import { Email } from "../../../domain/@shared/value-objects/email.value";
import { Money } from "../../../domain/@shared/value-objects/money.value";
import { CatalogType } from "../../../domain/@shared/value-objects/catalog-type.value";

describe("RemoveCatalogItemFromCatalogHandler", () => {
  const sellerRepoMock = { findById: mock(), save: mock() };
  const handler = new RemoveCatalogItemFromCatalogHandler(
    sellerRepoMock as any,
  );

  beforeEach(() => {
    sellerRepoMock.findById.mockReset();
    sellerRepoMock.save.mockReset();
  });

  it("Should remove item from catalog successfully", async () => {
    // Arrange
    const sellerId = Uuid.generate();
    const catalogId = Uuid.generate();
    const itemId = Uuid.generate();

    const seller = Seller.create(sellerId, "Seller", Email.create("s@s.com"));
    const catalog = Catalog.create(catalogId, "Cat", CatalogType.GENERAL);
    const item = CatalogItem.create(itemId, "Item", Money.create(100, "BRL"));

    catalog.addItem(item);
    seller.addCatalog(catalog);

    expect(seller.getCatalog(catalogId).hasAnyItem()).toBeTrue();

    const command = new RemoveCatalogItemFromCatalogCommand(
      sellerId.getValue(),
      catalogId.getValue(),
      itemId.getValue(),
    );

    sellerRepoMock.findById.mockResolvedValue(seller);

    const result = await handler.execute(command);

    expect(sellerRepoMock.save).toHaveBeenCalled();
    const savedSeller = sellerRepoMock.save.mock.calls[0][0] as Seller;

    expect(savedSeller.getCatalog(catalogId).hasAnyItem()).toBeFalse();
    expect(result.catalogId).toBe(catalogId.getValue());
    expect(result.itemId).toBe(itemId.getValue());
  });

  it("Should throw NotFoundException if seller not found", async () => {
    const command = new RemoveCatalogItemFromCatalogCommand(
      Uuid.generate().getValue(),
      Uuid.generate().getValue(),
      Uuid.generate().getValue(),
    );

    sellerRepoMock.findById.mockResolvedValue(null);

    expect(handler.execute(command)).rejects.toThrow(NotFoundException);
    expect(sellerRepoMock.save).not.toHaveBeenCalled();
  });
});
