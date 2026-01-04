import { describe, it, expect, beforeEach, mock } from "bun:test";
import { CreateSellerHandler } from "../../../application/commands/create-seller.handler";
import { CreateSellerCommand } from "../../../application/commands/dtos/create-seller.command";
import { Seller } from "../../../domain/seller/seller.aggregate";

describe("CreateSellerHandler", () => {
  const sellerRepoMock = { save: mock() };
  const handler = new CreateSellerHandler(sellerRepoMock as any);

  beforeEach(() => {
    sellerRepoMock.save.mockReset();
  });

  it("Should create seller successfully", async () => {
    const command = new CreateSellerCommand("New Seller", "seller@test.com");

    const result = await handler.execute(command);

    expect(sellerRepoMock.save).toHaveBeenCalled();
    const savedSeller = sellerRepoMock.save.mock.calls[0][0] as Seller;

    expect(savedSeller.name).toBe("New Seller");
    expect(savedSeller.email.getValue()).toBe("seller@test.com");
    expect(result.sellerId).toBeDefined();
  });

  it("Should throw error if email is invalid", async () => {
    const command = new CreateSellerCommand("Seller", "invalid-email");
    expect(handler.execute(command)).rejects.toThrow("Email format invalid");
    expect(sellerRepoMock.save).not.toHaveBeenCalled();
  });
});
