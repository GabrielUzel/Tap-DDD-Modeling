import { Field, InputType, ObjectType, Int } from "@nestjs/graphql";

@ObjectType()
export class SaleItem {
  @Field()
  catalogItemId!: string;

  @Field(() => Int)
  quantity!: number;

  @Field(() => Int)
  priceAmountInCents!: number;
}

@InputType()
export class GetSaleByIdInput {
  @Field()
  saleId!: string;
}

@ObjectType()
export class GetSaleByIdOutput {
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

  @Field(() => Int)
  totalAmountInCents!: number;

  @Field(() => [SaleItem])
  items!: SaleItem[];
}

@InputType()
export class GetSalesByOperationIdInput {
  @Field()
  operationId!: string;
}

@ObjectType()
export class GetSalesByOperationIdOutput {
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

  @Field(() => Int)
  totalAmountInCents!: number;

  @Field(() => [SaleItem])
  items!: SaleItem[];
}

@InputType()
export class GetSaleByTicketIdInput {
  @Field()
  ticketId!: string;
}

@ObjectType()
export class GetSaleByTicketIdOutput {
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

  @Field(() => Int)
  totalAmountInCents!: number;

  @Field(() => [SaleItem])
  items!: SaleItem[];
}
