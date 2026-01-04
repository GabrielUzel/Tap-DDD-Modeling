import { describe, it, expect, beforeEach, mock } from "bun:test";
import { CreateOperationHandler } from "../../../application/commands/create-operation.handler";
import { CreateOperationCommand } from "../../../application/commands/dtos/create-operation.command";
import { Operation } from "../../../domain/operation/operation.aggregate";

describe("CreateOperationHandler", () => {
  const operationRepoMock = { save: mock() };
  const handler = new CreateOperationHandler(operationRepoMock as any);

  beforeEach(() => {
    operationRepoMock.save.mockReset();
  });

  it("Should create operation successfully", async () => {
    const command = new CreateOperationCommand("New Operation");

    const result = await handler.execute(command);

    expect(operationRepoMock.save).toHaveBeenCalled();
    const savedOp = operationRepoMock.save.mock.calls[0][0] as Operation;

    expect(savedOp.name).toBe("New Operation");
    expect(savedOp.status.isPlanned()).toBeTrue();
    expect(result.operationId).toBeDefined();
  });
});
