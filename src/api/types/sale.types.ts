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
export class SaleItemToRegister {
  @Field()
  itemId!: string;

  @Field(() => Int)
  quantity!: number;
}

@InputType()
export class RegisterSaleInput {
  @Field()
  sellerId!: string;

  @Field()
  operationId!: string;

  @Field()
  operatorId!: string;

  @Field()
  catalogId!: string;

  @Field(() => [SaleItemToRegister])
  items!: SaleItemToRegister[];
}

@ObjectType()
export class RegisterSaleOutput {
  @Field()
  saleId!: string;

  @Field(() => Int)
  totalAmountInCents!: number;
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
