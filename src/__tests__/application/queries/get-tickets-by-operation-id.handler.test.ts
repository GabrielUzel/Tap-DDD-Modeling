import { describe, it, expect, beforeEach, mock } from "bun:test";
import { GetTicketsByOperationIdHandler } from "../../../application/queries/get-tickets-by-operation-id.handler";
import { GetTicketsByOperationIdQuery } from "../../../application/queries/dtos/get-tickets-by-operation-id.query";

describe("GetTicketsByOperationIdHandler", () => {
  const prismaMock = {
    ticket: { findMany: mock() },
  };
  const handler = new GetTicketsByOperationIdHandler(prismaMock as any);

  beforeEach(() => {
    prismaMock.ticket.findMany.mockReset();
  });

  it("Should return list of tickets for operation", async () => {
    const ticketsList = [{ id: "t1" }, { id: "t2" }];
    prismaMock.ticket.findMany.mockResolvedValue(ticketsList);

    const result = await handler.execute(
      new GetTicketsByOperationIdQuery("op-123"),
    );

    expect(result).toEqual(ticketsList);
    expect(prismaMock.ticket.findMany).toHaveBeenCalledWith({
      where: { operationId: "op-123" },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  });
});
