import { describe, it, expect, beforeEach, mock } from "bun:test";
import { GetOperatorsHandler } from "../../../application/queries/get-operators.handler";
import { GetOperatorsQuery } from "../../../application/queries/dtos/get-operators.query";

describe("GetOperatorsHandler", () => {
  const prismaMock = {
    operator: { findMany: mock() },
  };

  const handler = new GetOperatorsHandler(prismaMock as any);

  beforeEach(() => {
    prismaMock.operator.findMany.mockReset();
  });

  it("Should return operators for a seller", async () => {
    const list = [{ id: "1", name: "Op 1", email: "a@a.com" }];
    prismaMock.operator.findMany.mockResolvedValue(list);
    const result = await handler.execute(new GetOperatorsQuery("seller-123"));

    expect(result).toEqual(list);
    expect(prismaMock.operator.findMany).toHaveBeenCalledWith({
      where: { sellerId: "seller-123" },
    });
  });
});
