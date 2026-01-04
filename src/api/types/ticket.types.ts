import { Field, InputType, ObjectType, Int } from "@nestjs/graphql";

@ObjectType()
export class TicketItem {
  @Field()
  catalogItemId!: string;

  @Field(() => Int)
  quantity!: number;

  @Field(() => Int)
  priceAmountInCents!: number;

  @Field()
  priceSuffix!: string;
}

@InputType()
export class TicketItemToCreate {
  @Field()
  itemId!: string;

  @Field(() => Int)
  quantity!: number;
}

@InputType()
export class CreateTicketInput {
  @Field()
  sellerId!: string;

  @Field()
  operationId!: string;

  @Field()
  operatorId!: string;

  @Field()
  catalogId!: string;

  @Field(() => [TicketItemToCreate])
  items!: TicketItemToCreate[];
}

@ObjectType()
export class CreateTicketOutput {
  @Field()
  ticketId!: string;

  @Field(() => Int)
  totalAmountInCents!: number;
}

@InputType()
export class MarkTicketAsPaidInput {
  @Field()
  ticketId!: string;
}

@ObjectType()
export class MarkTicketAsPaidOutput {
  @Field()
  ticketId!: string;
}

@InputType()
export class CancelTicketInput {
  @Field()
  ticketId!: string;
}

@ObjectType()
export class CancelTicketOutput {
  @Field()
  ticketId!: string;
}

@InputType()
export class GetTicketByIdInput {
  @Field()
  ticketId!: string;
}

@ObjectType()
export class GetTicketByIdOutput {
  @Field()
  id!: string;

  @Field(() => Int)
  totalAmountInCents!: number;

  @Field(() => [TicketItem])
  items!: TicketItem[];
}

@InputType()
export class GetTicketsByOperationIdInput {
  @Field()
  operationId!: string;
}

@ObjectType()
export class GetTicketsByOperationIdOutput {
  @Field()
  id!: string;

  @Field()
  sellerId!: string;

  @Field()
  operatorId!: string;

  @Field()
  catalogId!: string;

  @Field()
  operationId!: string;

  @Field(() => [TicketItem])
  items!: TicketItem[];

  @Field(() => Int)
  totalAmountInCents!: number;

  @Field()
  status!: string;

  @Field(() => Date, { nullable: true })
  paidAt!: Date | null;

  @Field(() => Date)
  createdAt!: Date;
}

@InputType()
export class GetTicketsBySellerIdInput {
  @Field()
  sellerId!: string;
}

@ObjectType()
export class GetTicketsBySellerIdOutput {
  @Field()
  id!: string;

  @Field()
  sellerId!: string;

  @Field()
  operatorId!: string;

  @Field()
  catalogId!: string;

  @Field()
  operationId!: string;

  @Field(() => [TicketItem])
  items!: TicketItem[];

  @Field(() => Int)
  totalAmountInCents!: number;

  @Field()
  status!: string;

  @Field(() => Date, { nullable: true })
  paidAt!: Date | null;

  @Field(() => Date)
  createdAt!: Date;
}
