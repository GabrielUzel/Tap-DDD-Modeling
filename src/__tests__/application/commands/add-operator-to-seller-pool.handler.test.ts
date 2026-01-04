import { describe, it, expect, beforeEach, mock } from "bun:test";
import { NotFoundException } from "@nestjs/common";
import { AddOperatorToSellerPoolHandler } from "../../../application/commands/add-operator-to-seller-pool.handler";
import { AddOperatorToSellerPoolCommand } from "../../../application/commands/dtos/add-operator-to-seller-pool.command";
import { Seller } from "../../../domain/seller/seller.aggregate";
import { Uuid } from "../../../domain/@shared/interfaces/uuid";
import { Email } from "../../../domain/@shared/value-objects/email.value";

describe("AddOperatorToSellerPoolHandler tests", () => {
  const sellerRepositoryMock = {
    findById: mock(),
    save: mock(),
  };

  const handler = new AddOperatorToSellerPoolHandler(
    sellerRepositoryMock as any,
  );

  beforeEach(() => {
    sellerRepositoryMock.findById.mockReset();
    sellerRepositoryMock.save.mockReset();
  });

  it("Should add operator to seller pool successfully", async () => {
    const sellerId = Uuid.generate();

    const existingSeller = Seller.create(
      sellerId,
      "Existing Seller",
      Email.create("seller@test.com"),
    );

    const command = new AddOperatorToSellerPoolCommand(
      sellerId.getValue(),
      "New Operator",
      "operator@test.com",
    );

    sellerRepositoryMock.findById.mockResolvedValue(existingSeller);
    const result = await handler.execute(command);

    expect(sellerRepositoryMock.findById).toHaveBeenCalled();
    expect(sellerRepositoryMock.save).toHaveBeenCalled();

    const savedSeller = sellerRepositoryMock.save.mock.calls[0][0] as Seller;

    expect(savedSeller.operators.length).toBe(1);
    expect(savedSeller.operators[0].name).toBe("New Operator");
    expect(result.sellerId).toBe(sellerId.getValue());
    expect(result.operatorId).toBeDefined();
  });

  it("Should throw NotFoundException when seller does not exist", async () => {
    const command = new AddOperatorToSellerPoolCommand(
      Uuid.generate().getValue(),
      "Op",
      "op@test.com",
    );

    sellerRepositoryMock.findById.mockResolvedValue(null);

    expect(handler.execute(command)).rejects.toThrow(NotFoundException);
    expect(sellerRepositoryMock.save).not.toHaveBeenCalled();
  });

  it("Should propagate domain errors (e.g. Invalid Email)", async () => {
    const sellerId = Uuid.generate();
    const existingSeller = Seller.create(
      sellerId,
      "Seller",
      Email.create("s@s.com"),
    );

    const command = new AddOperatorToSellerPoolCommand(
      sellerId.getValue(),
      "Op",
      "invalid-email",
    );

    sellerRepositoryMock.findById.mockResolvedValue(existingSeller);

    expect(handler.execute(command)).rejects.toThrow("Email format invalid");
    expect(sellerRepositoryMock.save).not.toHaveBeenCalled();
  });
});
