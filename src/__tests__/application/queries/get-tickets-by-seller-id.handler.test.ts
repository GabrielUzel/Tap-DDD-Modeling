import { describe, it, expect, beforeEach, mock } from "bun:test";
import { GetTicketsBySellerIdHandler } from "../../../application/queries/get-tickets-by-seller-id.handler";
import { GetTicketsBySellerIdQuery } from "../../../application/queries/dtos/get-tickets-by-seller-id.query";

describe("GetTicketsBySellerIdHandler", () => {
  const prismaMock = {
    ticket: { findMany: mock() },
  };
  const handler = new GetTicketsBySellerIdHandler(prismaMock as any);

  beforeEach(() => {
    prismaMock.ticket.findMany.mockReset();
  });

  it("Should return list of tickets for seller", async () => {
    const ticketsList = [{ id: "t1" }, { id: "t2" }];
    prismaMock.ticket.findMany.mockResolvedValue(ticketsList);

    const result = await handler.execute(
      new GetTicketsBySellerIdQuery("seller-123"),
    );

    expect(result).toEqual(ticketsList);
    expect(prismaMock.ticket.findMany).toHaveBeenCalledWith({
      where: { sellerId: "seller-123" },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  });
});
