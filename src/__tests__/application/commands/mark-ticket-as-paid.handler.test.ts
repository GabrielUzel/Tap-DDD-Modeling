import { describe, it, expect, beforeEach, mock } from "bun:test";
import { NotFoundException } from "@nestjs/common";
import { MarkTicketAsPaidHandler } from "../../../application/commands/mark-ticket-as-paid.handler";
import { MarkTicketAsPaidCommand } from "../../../application/commands/dtos/mark-ticket-as-paid.command";
import { Ticket } from "../../../domain/ticket/ticket.aggregate";
import { Uuid } from "../../../domain/@shared/interfaces/uuid";
import { SaleItem } from "../../../domain/@shared/value-objects/sale-item.value";
import { Money } from "../../../domain/@shared/value-objects/money.value";

describe("MarkTicketAsPaidHandler", () => {
  const ticketRepoMock = { findById: mock(), save: mock() };
  const eventBusMock = { publish: mock() };

  const handler = new MarkTicketAsPaidHandler(
    ticketRepoMock as any,
    eventBusMock as any,
  );

  beforeEach(() => {
    ticketRepoMock.findById.mockReset();
    ticketRepoMock.save.mockReset();
    eventBusMock.publish.mockReset();
  });

  it("Should mark ticket as paid and publish event", async () => {
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

    const command = new MarkTicketAsPaidCommand(ticketId.getValue());
    ticketRepoMock.findById.mockResolvedValue(ticket);

    await handler.execute(command);

    expect(ticketRepoMock.save).toHaveBeenCalled();
    const savedTicket = ticketRepoMock.save.mock.calls[0][0] as Ticket;
    expect(savedTicket.status.isPaid()).toBeTrue();

    expect(eventBusMock.publish).toHaveBeenCalled();
  });
});
