import { describe, it, expect, beforeEach, mock } from "bun:test";
import { NotFoundException } from "@nestjs/common";
import { GetOperationByIdHandler } from "../../../application/queries/get-operation-by-id.handler";
import { GetOperationByIdQuery } from "../../../application/queries/dtos/get-operation-by-id.query";
import { Uuid } from "../../../domain/@shared/interfaces/uuid";

describe("GetOperationByIdHandler", () => {
  const prismaMock = {
    operation: { findUnique: mock() },
  };

  const handler = new GetOperationByIdHandler(prismaMock as any);

  beforeEach(() => {
    prismaMock.operation.findUnique.mockReset();
  });

  it("Should return operation if found", async () => {
    const id = Uuid.generate().getValue();
    const opData = { id, name: "Op", status: "PLANNED" };
    prismaMock.operation.findUnique.mockResolvedValue(opData);

    const result = await handler.execute(new GetOperationByIdQuery(id));
    expect(result).toEqual(opData);
  });

  it("Should throw NotFoundException if operation not found", async () => {
    prismaMock.operation.findUnique.mockResolvedValue(null);
    const id = Uuid.generate().getValue();

    expect(handler.execute(new GetOperationByIdQuery(id))).rejects.toThrow(
      NotFoundException,
    );
  });
});
