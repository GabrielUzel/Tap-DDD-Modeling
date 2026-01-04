import { describe, it, expect, beforeEach, mock } from "bun:test";
import { NotFoundException } from "@nestjs/common";
import { CancelTicketHandler } from "../../../application/commands/cancel-ticket.handler";
import { CancelTicketCommand } from "../../../application/commands/dtos/cancel-ticket.command";
import { Ticket } from "../../../domain/ticket/ticket.aggregate";
import { Uuid } from "../../../domain/@shared/interfaces/uuid";
import { SaleItem } from "../../../domain/@shared/value-objects/sale-item.value";
import { Money } from "../../../domain/@shared/value-objects/money.value";

describe("CancelTicketHandler", () => {
  const ticketRepoMock = { findById: mock(), save: mock() };
  const handler = new CancelTicketHandler(ticketRepoMock as any);

  beforeEach(() => {
    ticketRepoMock.findById.mockReset();
    ticketRepoMock.save.mockReset();
  });

  it("Should cancel ticket successfully", async () => {
    const ticketId = Uuid.generate();
    const item = SaleItem.create(Uuid.generate(), 1, Money.create(100, "BRL"));

    const ticket = Ticket.create(
      ticketId,
      Uuid.generate(),
      Uuid.generate(),
      Uuid.generate(),
      Uuid.generate(),
      [item],
    );

    const command = new CancelTicketCommand(ticketId.getValue());
    ticketRepoMock.findById.mockResolvedValue(ticket);

    await handler.execute(command);

    expect(ticketRepoMock.save).toHaveBeenCalled();
    const savedTicket = ticketRepoMock.save.mock.calls[0][0] as Ticket;
    expect(savedTicket.status.isCancelled()).toBeTrue();
  });

  it("Should throw NotFoundException if ticket not found", async () => {
    const command = new CancelTicketCommand(Uuid.generate().getValue());
    ticketRepoMock.findById.mockResolvedValue(null);

    expect(handler.execute(command)).rejects.toThrow(NotFoundException);
    expect(ticketRepoMock.save).not.toHaveBeenCalled();
  });
});
