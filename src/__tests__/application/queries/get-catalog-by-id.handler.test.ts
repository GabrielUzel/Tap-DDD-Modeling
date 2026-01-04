import { describe, it, expect, beforeEach, mock } from "bun:test";
import { NotFoundException } from "@nestjs/common";
import { GetCatalogByIdHandler } from "../../../application/queries/get-catalog-by-id.handler";
import { GetCatalogByIdQuery } from "../../../application/queries/dtos/get-catalog-by-id.query";

describe("GetCatalogByIdHandler", () => {
  const prismaMock = {
    catalog: { findUnique: mock() },
  };

  const handler = new GetCatalogByIdHandler(prismaMock as any);

  beforeEach(() => {
    prismaMock.catalog.findUnique.mockReset();
  });

  it("Should return catalog if found", async () => {
    const catalogData = {
      id: "123",
      name: "Cat",
      type: "general",
      items: [],
    };

    prismaMock.catalog.findUnique.mockResolvedValue(catalogData);
    const result = await handler.execute(new GetCatalogByIdQuery("123"));

    expect(result).toEqual(catalogData);
    expect(prismaMock.catalog.findUnique).toHaveBeenCalledWith({
      where: { id: "123" },
      include: { items: true },
    });
  });

  it("Should throw NotFoundException if catalog not found", async () => {
    prismaMock.catalog.findUnique.mockResolvedValue(null);

    expect(handler.execute(new GetCatalogByIdQuery("999"))).rejects.toThrow(
      NotFoundException,
    );
  });
});
