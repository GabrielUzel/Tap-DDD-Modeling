import { describe, it, expect, beforeEach, mock } from "bun:test";
import { NotFoundException } from "@nestjs/common";
import { GetSellerByIdHandler } from "../../../application/queries/get-seller-by-id.handler";
import { GetSellerByIdQuery } from "../../../application/queries/dtos/get-seller-by-id.query";

describe("GetSellerByIdHandler", () => {
  const prismaMock = {
    seller: { findUnique: mock() },
  };

  const handler = new GetSellerByIdHandler(prismaMock as any);

  beforeEach(() => {
    prismaMock.seller.findUnique.mockReset();
  });

  it("Should return seller if found", async () => {
    const sellerData = { id: "s1", name: "Seller", email: "s@s.com" };
    prismaMock.seller.findUnique.mockResolvedValue(sellerData);
    const result = await handler.execute(new GetSellerByIdQuery("s1"));

    expect(result).toEqual(sellerData);
  });

  it("Should throw NotFoundException if seller not found", async () => {
    prismaMock.seller.findUnique.mockResolvedValue(null);

    expect(handler.execute(new GetSellerByIdQuery("s99"))).rejects.toThrow(
      NotFoundException,
    );
  });
});
