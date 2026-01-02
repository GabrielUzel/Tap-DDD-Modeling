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
export class GetSaleInput {
  @Field()
  saleId!: string;
}

@ObjectType()
export class GetSaleOutput {
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
