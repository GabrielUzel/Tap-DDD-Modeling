import { describe, it, expect, beforeEach, mock } from "bun:test";
import { GetOperationsHandler } from "../../../application/queries/get-operations.handler";
import { GetOperationsQuery } from "../../../application/queries/dtos/get-operations.query";

describe("GetOperationsHandler", () => {
  const prismaMock = {
    operation: { findMany: mock() },
  };

  const handler = new GetOperationsHandler(prismaMock as any);

  beforeEach(() => {
    prismaMock.operation.findMany.mockReset();
  });

  it("Should return list of operations", async () => {
    const list = [{ id: "1", name: "Op 1", status: "PLANNED" }];
    prismaMock.operation.findMany.mockResolvedValue(list);

    const result = await handler.execute(new GetOperationsQuery());
    expect(result).toEqual(list);
    expect(prismaMock.operation.findMany).toHaveBeenCalled();
  });
});
