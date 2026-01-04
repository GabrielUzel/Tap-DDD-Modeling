import { describe, it, expect, beforeEach, mock } from "bun:test";
import { NotFoundException } from "@nestjs/common";
import { CreateTicketHandler } from "../../../application/commands/create-ticket.handler";
import { CreateTicketCommand } from "../../../application/commands/dtos/create-ticket.command";
import { Operation } from "../../../domain/operation/operation.aggregate";
import { Seller } from "../../../domain/seller/seller.aggregate";
import { Catalog } from "../../../domain/seller/catalog.entity";
import { CatalogItem } from "../../../domain/seller/catalog-item.entity";
import { Uuid } from "../../../domain/@shared/interfaces/uuid";
import { Email } from "../../../domain/@shared/value-objects/email.value";
import { Money } from "../../../domain/@shared/value-objects/money.value";
import { CatalogType } from "../../../domain/@shared/value-objects/catalog-type.value";
import { Ticket } from "../../../domain/ticket/ticket.aggregate";

describe("CreateTicketHandler", () => {
  const opRepoMock = { findById: mock() };
  const sellerRepoMock = { findById: mock() };
  const ticketRepoMock = { save: mock() };

  const handler = new CreateTicketHandler(
    opRepoMock as any,
    sellerRepoMock as any,
    ticketRepoMock as any,
  );

  beforeEach(() => {
    opRepoMock.findById.mockReset();
    sellerRepoMock.findById.mockReset();
    ticketRepoMock.save.mockReset();
  });

  it("Should create ticket successfully", async () => {
    const opId = Uuid.generate();
    const sellerId = Uuid.generate();
    const catalogId = Uuid.generate();
    const itemId = Uuid.generate();
    const operatorId = Uuid.generate();

    const operation = Operation.create(opId, "Op");

    const seller = Seller.create(sellerId, "Seller", Email.create("s@s.com"));
    const catalog = Catalog.create(catalogId, "Cat", CatalogType.GENERAL);
    const item = CatalogItem.create(itemId, "Item", Money.create(100, "BRL"));

    catalog.addItem(item);
    seller.addCatalog(catalog);

    const command = new CreateTicketCommand(
      opId.getValue(),
      sellerId.getValue(),
      operatorId.getValue(),
      catalogId.getValue(),
      [{ itemId: itemId.getValue(), quantity: 2 }],
    );

    opRepoMock.findById.mockResolvedValue(operation);
    sellerRepoMock.findById.mockResolvedValue(seller);

    const result = await handler.execute(command);

    expect(ticketRepoMock.save).toHaveBeenCalled();
    const savedTicket = ticketRepoMock.save.mock.calls[0][0] as Ticket;

    expect(savedTicket.totalAmountInCents).toBe(200);
    expect(savedTicket.status.isOpen()).toBeTrue();
    expect(result.ticketId).toBeDefined();
    expect(result.totalAmountInCents).toBe(200);
  });

  it("Should throw NotFoundException if operation missing", async () => {
    const command = new CreateTicketCommand(
      Uuid.generate().getValue(),
      Uuid.generate().getValue(),
      Uuid.generate().getValue(),
      Uuid.generate().getValue(),
      [],
    );
    opRepoMock.findById.mockResolvedValue(null);
    expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });
});
