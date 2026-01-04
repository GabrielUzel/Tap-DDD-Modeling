import { describe, it, expect, beforeEach, mock } from "bun:test";
import { GetSaleByTicketIdHandler } from "../../../application/queries/get-sale-by-ticket-id.handler";
import { GetSaleByTicketIdQuery } from "../../../application/queries/dtos/get-sale-by-ticket-id.query";

describe("GetSaleByTicketIdHandler", () => {
  const prismaMock = {
    sale: { findFirst: mock() },
  };

  const handler = new GetSaleByTicketIdHandler(prismaMock as any);

  beforeEach(() => {
    prismaMock.sale.findFirst.mockReset();
  });

  it("Should return sale if found for ticket", async () => {
    const saleData = { id: "sale-1", ticketId: "ticket-1" };
    prismaMock.sale.findFirst.mockResolvedValue(saleData);

    const result = await handler.execute(
      new GetSaleByTicketIdQuery("ticket-1"),
    );

    expect(result).toEqual(saleData);
    expect(prismaMock.sale.findFirst).toHaveBeenCalledWith({
      where: { ticketId: "ticket-1" },
      include: { items: true },
    });
  });

  it("Should return null if sale not found", async () => {
    prismaMock.sale.findFirst.mockResolvedValue(null);

    const result = await handler.execute(
      new GetSaleByTicketIdQuery("ticket-99"),
    );

    expect(result).toBeNull();
  });
});
