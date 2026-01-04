import { describe, it, expect, beforeEach, mock } from "bun:test";
import { NotFoundException } from "@nestjs/common";
import { CreateAssignmentHandler } from "../../../application/commands/create-assignment.handler";
import { CreateAssignmentCommand } from "../../../application/commands/dtos/create-assignment.command";
import { Operation } from "../../../domain/operation/operation.aggregate";
import { Seller } from "../../../domain/seller/seller.aggregate";
import { Catalog } from "../../../domain/seller/catalog.entity";
import { Operator } from "../../../domain/seller/operator.entity";
import { Uuid } from "../../../domain/@shared/interfaces/uuid";
import { Email } from "../../../domain/@shared/value-objects/email.value";
import { CatalogType } from "../../../domain/@shared/value-objects/catalog-type.value";

describe("CreateAssignmentHandler", () => {
  const opRepoMock = { findById: mock() };
  const sellerRepoMock = { findById: mock(), save: mock() };

  const handler = new CreateAssignmentHandler(
    opRepoMock as any,
    sellerRepoMock as any,
  );

  beforeEach(() => {
    opRepoMock.findById.mockReset();
    sellerRepoMock.findById.mockReset();
    sellerRepoMock.save.mockReset();
  });

  it("Should create assignment successfully", async () => {
    const opId = Uuid.generate();
    const sellerId = Uuid.generate();
    const catalogId = Uuid.generate();
    const operatorId = Uuid.generate();

    const operation = Operation.create(opId, "Op");
    operation.addSeller(sellerId);

    const seller = Seller.create(sellerId, "Seller", Email.create("s@s.com"));
    const catalog = Catalog.create(catalogId, "Cat", CatalogType.GENERAL);
    const operator = Operator.create(
      operatorId,
      "Op",
      Email.create("op@op.com"),
    );

    seller.addCatalog(catalog);
    seller.addOperatorToPool(operator);

    const command = new CreateAssignmentCommand(
      opId.getValue(),
      sellerId.getValue(),
      operatorId.getValue(),
      catalogId.getValue(),
      "cashier",
    );

    opRepoMock.findById.mockResolvedValue(operation);
    sellerRepoMock.findById.mockResolvedValue(seller);
    const result = await handler.execute(command);

    expect(sellerRepoMock.save).toHaveBeenCalled();
    const savedSeller = sellerRepoMock.save.mock.calls[0][0] as Seller;

    expect(
      savedSeller.isOperatorAlreadyAssigned(operatorId, catalogId),
    ).toBeTrue();
    expect(result.role).toBe("cashier");
  });

  it("Should throw Error if seller does not belong to operation", async () => {
    const opId = Uuid.generate();
    const sellerId = Uuid.generate();

    const operation = Operation.create(opId, "Op");
    const seller = Seller.create(sellerId, "Seller", Email.create("s@s.com"));

    const command = new CreateAssignmentCommand(
      opId.getValue(),
      sellerId.getValue(),
      Uuid.generate().getValue(),
      Uuid.generate().getValue(),
      "cashier",
    );

    opRepoMock.findById.mockResolvedValue(operation);
    sellerRepoMock.findById.mockResolvedValue(seller);

    expect(handler.execute(command)).rejects.toThrow(
      "Seller does not belong to this operation",
    );
    expect(sellerRepoMock.save).not.toHaveBeenCalled();
  });
});
