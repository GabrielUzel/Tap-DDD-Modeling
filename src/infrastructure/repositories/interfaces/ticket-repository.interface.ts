import { Ticket } from "src/domain/ticket/ticket.aggregate";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

export interface ITicketRepository {
  save(ticket: Ticket): Promise<void>;
  findById(id: Uuid): Promise<Ticket | null>;
}
