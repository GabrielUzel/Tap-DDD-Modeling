import { Resolver, Mutation, Query, Args } from "@nestjs/graphql";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateTicketCommand } from "src/application/commands/dtos/create-ticket.command";
import { MarkTicketAsPaidCommand } from "src/application/commands/dtos/mark-ticket-as-paid.command";
import { CancelTicketCommand } from "src/application/commands/dtos/cancel-ticket.command";
import { GetTicketByIdQuery } from "src/application/queries/dtos/get-ticket-by-id.query";
import { GetTicketsByOperationIdQuery } from "src/application/queries/dtos/get-tickets-by-operation-id.query";
import { GetTicketsBySellerIdQuery } from "src/application/queries/dtos/get-tickets-by-seller-id.query";

import {
  CreateTicketInput,
  CreateTicketOutput,
  MarkTicketAsPaidInput,
  MarkTicketAsPaidOutput,
  CancelTicketInput,
  CancelTicketOutput,
  GetTicketByIdInput,
  GetTicketByIdOutput,
  GetTicketsByOperationIdInput,
  GetTicketsByOperationIdOutput,
  GetTicketsBySellerIdInput,
  GetTicketsBySellerIdOutput,
} from "../types/ticket.types";

@Resolver()
export class TicketResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Mutation(() => CreateTicketOutput)
  async createTicket(
    @Args("input") input: CreateTicketInput,
  ): Promise<CreateTicketOutput> {
    return this.commandBus.execute(
      new CreateTicketCommand(
        input.operationId,
        input.sellerId,
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

  @Query(() => GetTicketByIdOutput)
  async getTicketById(
    @Args("input") input: GetTicketByIdInput,
  ): Promise<GetTicketByIdOutput> {
    return this.queryBus.execute(new GetTicketByIdQuery(input.ticketId));
  }

  @Query(() => [GetTicketsByOperationIdOutput])
  async getTicketsByOperationId(
    @Args("input") input: GetTicketsByOperationIdInput,
  ): Promise<GetTicketsByOperationIdOutput[]> {
    return this.queryBus.execute(
      new GetTicketsByOperationIdQuery(input.operationId),
    );
  }

  @Query(() => [GetTicketsBySellerIdOutput])
  async getTicketsBySellerId(
    @Args("input") input: GetTicketsBySellerIdInput,
  ): Promise<GetTicketsBySellerIdOutput[]> {
    return this.queryBus.execute(new GetTicketsBySellerIdQuery(input.sellerId));
  }
}
