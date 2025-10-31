import { Field, InputType, ObjectType, Int, Float } from "@nestjs/graphql";

@InputType()
export class RegisterSaleItemInput {
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

  @Field(() => [RegisterSaleItemInput])
  items!: RegisterSaleItemInput[];
}

@ObjectType()
export class RegisterSaleOutput {
  @Field()
  saleId!: string;

  @Field(() => Float)
  totalAmount!: number;
}

@InputType()
export class GetSaleInput {
  @Field()
  saleId!: string;
}

@ObjectType()
export class SaleItemOutput {
  @Field()
  itemId!: string;

  @Field(() => Int)
  quantity!: number;

  @Field(() => Float)
  salePrice!: number;

  @Field(() => Float)
  total!: number;
}

@ObjectType()
export class GetSaleOutput {
  @Field()
  saleId!: string;

  @Field()
  sellerId!: string;

  @Field()
  operatorId!: string;

  @Field()
  catalogId!: string;

  @Field()
  operationId!: string;

  @Field(() => Float)
  totalAmount!: number;

  @Field(() => [SaleItemOutput])
  items!: SaleItemOutput[];
}
