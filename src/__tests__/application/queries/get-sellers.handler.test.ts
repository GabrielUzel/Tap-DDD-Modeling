import { describe, it, expect, beforeEach, mock } from "bun:test";
import { NotFoundException } from "@nestjs/common";
import { GetSellersHandler } from "../../../application/queries/get-sellers.handler";
import { GetSellersQuery } from "../../../application/queries/dtos/get-sellers.query";

describe("GetSellersHandler", () => {
  const prismaMock = {
    operation: { findUnique: mock() },
    seller: { findMany: mock() },
  };
  const handler = new GetSellersHandler(prismaMock as any);

  beforeEach(() => {
    prismaMock.operation.findUnique.mockReset();
    prismaMock.seller.findMany.mockReset();
  });

  it("Should return list of sellers if operation exists", async () => {
    const opId = "op-123";
    const sellerIds = ["s1", "s2"];
    const sellersList = [
      { id: "s1", name: "Seller 1", email: "s1@test.com" },
      { id: "s2", name: "Seller 2", email: "s2@test.com" },
    ];

    prismaMock.operation.findUnique.mockResolvedValue({ id: opId, sellerIds });
    prismaMock.seller.findMany.mockResolvedValue(sellersList);

    const result = await handler.execute(new GetSellersQuery(opId));

    expect(result).toEqual(sellersList);
    expect(prismaMock.operation.findUnique).toHaveBeenCalledWith({
      where: { id: opId },
    });
    expect(prismaMock.seller.findMany).toHaveBeenCalledWith({
      where: { id: { in: sellerIds } },
    });
  });

  it("Should throw NotFoundException if operation not found", async () => {
    prismaMock.operation.findUnique.mockResolvedValue(null);

    expect(handler.execute(new GetSellersQuery("op-999"))).rejects.toThrow(
      NotFoundException,
    );
    expect(prismaMock.seller.findMany).not.toHaveBeenCalled();
  });
});
