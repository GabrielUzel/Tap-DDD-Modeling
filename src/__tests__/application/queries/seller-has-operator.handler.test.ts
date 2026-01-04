import { describe, it, expect, beforeEach, mock } from "bun:test";
import { SellerHasOperatorHandler } from "../../../application/queries/seller-has-operator.handler";
import { SellerHasOperatorQuery } from "../../../application/queries/dtos/seller-has-operator.query";

describe("SellerHasOperatorHandler", () => {
  const prismaMock = {
    seller: { findFirst: mock() },
  };
  const handler = new SellerHasOperatorHandler(prismaMock as any);

  beforeEach(() => {
    prismaMock.seller.findFirst.mockReset();
  });

  it("Should return true if relationship exists", async () => {
    prismaMock.seller.findFirst.mockResolvedValue({ id: "seller-123" });

    const result = await handler.execute(
      new SellerHasOperatorQuery("seller-123", "op-456"),
    );

    expect(result.hasOperator).toBeTrue();
    expect(prismaMock.seller.findFirst).toHaveBeenCalledWith({
      where: {
        id: "seller-123",
        operators: { some: { id: "op-456" } },
      },
      select: { id: true },
    });
  });

  it("Should return false if relationship does not exist", async () => {
    prismaMock.seller.findFirst.mockResolvedValue(null);

    const result = await handler.execute(
      new SellerHasOperatorQuery("seller-123", "op-999"),
    );

    expect(result.hasOperator).toBeFalse();
  });
});
