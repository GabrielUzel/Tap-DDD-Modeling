import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { CommandBus } from "@nestjs/cqrs";
import { CreateTicketCommand } from "src/application/services/commands/dtos/create-ticket.command";
import { MarkTicketAsPaidCommand } from "src/application/services/commands/dtos/mark-ticket-as-paid.command";
import { CancelTicketCommand } from "src/application/services/commands/dtos/cancel-ticket.command";
import {
  CreateTicketInput,
  CreateTicketOutput,
  MarkTicketAsPaidInput,
  MarkTicketAsPaidOutput,
  CancelTicketInput,
  CancelTicketOutput,
} from "../types/ticket.types";

@Resolver()
export class TicketResolver {
  constructor(private readonly commandBus: CommandBus) {}

  @Mutation(() => CreateTicketOutput)
  async createTicket(
    @Args("input") input: CreateTicketInput,
  ): Promise<CreateTicketOutput> {
    return this.commandBus.execute(
      new CreateTicketCommand(
        input.sellerId,
        input.operationId,
        input.operatorId,
        input.catalogId,
        input.items,
      ),
    );
  }

  @Mutation(() => MarkTicketAsPaidOutput)
  async markTicketAsPaid(
    @Args("input") input: MarkTicketAsPaidInput,
  ): Promise<MarkTicketAsPaidOutput> {
    await this.commandBus.execute(new MarkTicketAsPaidCommand(input.ticketId));
    return { ticketId: input.ticketId };
  }

  @Mutation(() => CancelTicketOutput)
  async cancelTicket(
    @Args("input") input: CancelTicketInput,
  ): Promise<CancelTicketOutput> {
    await this.commandBus.execute(new CancelTicketCommand(input.ticketId));
    return { ticketId: input.ticketId };
  }
}
