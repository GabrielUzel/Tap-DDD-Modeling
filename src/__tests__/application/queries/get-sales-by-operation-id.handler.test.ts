import { describe, it, expect, beforeEach, mock } from "bun:test";
import { GetSalesByOperationIdHandler } from "../../../application/queries/get-sales-by-operation-id.handler";
import { GetSalesByOperationIdQuery } from "../../../application/queries/dtos/get-sales-by-operation-id.query";

describe("GetSalesByOperationIdHandler", () => {
  const prismaMock = {
    sale: { findMany: mock() },
  };

  const handler = new GetSalesByOperationIdHandler(prismaMock as any);

  beforeEach(() => {
    prismaMock.sale.findMany.mockReset();
  });

  it("Should return sales list", async () => {
    const list = [{ id: "s1" }, { id: "s2" }];
    prismaMock.sale.findMany.mockResolvedValue(list);

    const result = await handler.execute(
      new GetSalesByOperationIdQuery("op-1"),
    );

    expect(result).toEqual(list);
    expect(prismaMock.sale.findMany).toHaveBeenCalledWith({
      where: { operationId: "op-1" },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  });
});
