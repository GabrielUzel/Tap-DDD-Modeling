import { describe, it, expect, beforeEach, mock } from "bun:test";
import { NotFoundException } from "@nestjs/common";
import { AddSellerToOperationHandler } from "../../../application/commands/add-seller-to-operation.handler";
import { AddSellerToOperationCommand } from "../../../application/commands/dtos/add-seller-to-operation.command";
import { Operation } from "../../../domain/operation/operation.aggregate";
import { Seller } from "../../../domain/seller/seller.aggregate";
import { Uuid } from "../../../domain/@shared/interfaces/uuid";
import { Email } from "../../../domain/@shared/value-objects/email.value";

describe("AddSellerToOperationHandler", () => {
  const operationRepoMock = { findById: mock(), save: mock() };
  const sellerRepoMock = { findById: mock(), save: mock() };

  const handler = new AddSellerToOperationHandler(
    operationRepoMock as any,
    sellerRepoMock as any,
  );

  beforeEach(() => {
    operationRepoMock.findById.mockReset();
    operationRepoMock.save.mockReset();
    sellerRepoMock.findById.mockReset();
  });

  it("Should add seller to operation successfully", async () => {
    const opId = Uuid.generate();
    const sellerId = Uuid.generate();

    const operation = Operation.create(opId, "Op Test");
    const seller = Seller.create(
      sellerId,
      "Seller Test",
      Email.create("s@s.com"),
    );

    const command = new AddSellerToOperationCommand(
      opId.getValue(),
      sellerId.getValue(),
    );

    operationRepoMock.findById.mockResolvedValue(operation);
    sellerRepoMock.findById.mockResolvedValue(seller);

    const result = await handler.execute(command);

    expect(operationRepoMock.findById).toHaveBeenCalled();
    expect(sellerRepoMock.findById).toHaveBeenCalled();
    expect(operationRepoMock.save).toHaveBeenCalled();

    const savedOp = operationRepoMock.save.mock.calls[0][0] as Operation;
    expect(savedOp.hasSeller(sellerId)).toBeTrue();

    expect(result.operationId).toBe(opId.getValue());
    expect(result.sellerId).toBe(sellerId.getValue());
  });

  it("Should throw NotFoundException if operation not found", async () => {
    const command = new AddSellerToOperationCommand(
      Uuid.generate().getValue(),
      Uuid.generate().getValue(),
    );
    operationRepoMock.findById.mockResolvedValue(null);

    expect(handler.execute(command)).rejects.toThrow(NotFoundException);
    expect(operationRepoMock.save).not.toHaveBeenCalled();
  });

  it("Should throw NotFoundException if seller not found", async () => {
    const opId = Uuid.generate();
    const command = new AddSellerToOperationCommand(
      opId.getValue(),
      Uuid.generate().getValue(),
    );

    const operation = Operation.create(opId, "Op Test");
    operationRepoMock.findById.mockResolvedValue(operation);
    sellerRepoMock.findById.mockResolvedValue(null);

    expect(handler.execute(command)).rejects.toThrow(NotFoundException);
    expect(operationRepoMock.save).not.toHaveBeenCalled();
  });
});
