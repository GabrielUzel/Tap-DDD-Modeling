import { describe, it, expect, beforeEach, mock } from "bun:test";
import { NotFoundException } from "@nestjs/common";
import { GetTicketByIdHandler } from "../../../application/queries/get-ticket-by-id.handler";
import { GetTicketByIdQuery } from "../../../application/queries/dtos/get-ticket-by-id.query";

describe("GetTicketByIdHandler", () => {
  const prismaMock = {
    ticket: { findUnique: mock() },
  };
  const handler = new GetTicketByIdHandler(prismaMock as any);

  beforeEach(() => {
    prismaMock.ticket.findUnique.mockReset();
  });

  it("Should return ticket if found", async () => {
    const ticketData = { id: "ticket-123", totalAmountInCents: 100, items: [] };
    prismaMock.ticket.findUnique.mockResolvedValue(ticketData);
    const result = await handler.execute(new GetTicketByIdQuery("ticket-123"));

    expect(result).toEqual(ticketData);
    expect(prismaMock.ticket.findUnique).toHaveBeenCalledWith({
      where: { id: "ticket-123" },
      include: { items: true },
    });
  });

  it("Should throw NotFoundException if ticket not found", async () => {
    prismaMock.ticket.findUnique.mockResolvedValue(null);

    expect(
      handler.execute(new GetTicketByIdQuery("ticket-999")),
    ).rejects.toThrow(NotFoundException);
  });
});
