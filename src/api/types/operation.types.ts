import { Field, InputType, ObjectType, Float } from "@nestjs/graphql";

@ObjectType()
export class OperationType {
  @Field()
  operationId!: string;

  @Field()
  name!: string;

  @Field()
  status!: string;
}

@ObjectType()
export class SellerType {
  @Field()
  sellerId!: string;

  @Field()
  name!: string;

  @Field()
  email!: string;
}

@InputType()
export class CreateOperationInput {
  @Field()
  name!: string;
}

@ObjectType()
export class CreateOperationOutput {
  @Field()
  operationId!: string;
}

@ObjectType()
export class GetOperationsOutput {
  @Field(() => [OperationType])
  operations!: OperationType[];
}

@InputType()
export class GetOperationInput {
  @Field()
  operationId!: string;
}

@ObjectType()
export class GetOperationOutput {
  @Field()
  operationId!: string;

  @Field()
  name!: string;

  @Field()
  status!: string;
}

@InputType()
export class GetSellersInput {
  @Field()
  operationId!: string;
}

@ObjectType()
export class GetSellersOutput {
  @Field()
  operationId!: string;

  @Field(() => [SellerType])
  sellers!: SellerType[];
}

@InputType()
export class AddSellerInput {
  @Field()
  operationId!: string;

  @Field()
  sellerId!: string;
}

@ObjectType()
export class AddSellerOutput {
  @Field()
  operationId!: string;

  @Field()
  sellerId!: string;
}

@InputType()
export class AddCatalogInput {
  @Field()
  operationId!: string;

  @Field()
  sellerId!: string;

  @Field()
  catalogName!: string;

  @Field()
  catalogType!: string;
}

@ObjectType()
export class AddCatalogOutput {
  @Field()
  operationId!: string;

  @Field()
  sellerId!: string;

  @Field()
  catalogId!: string;
}

@InputType()
export class AddCatalogItemInput {
  @Field()
  operationId!: string;

  @Field()
  sellerId!: string;

  @Field()
  catalogId!: string;

  @Field()
  itemName!: string;

  @Field(() => Float)
  itemPriceAmount!: number;

  @Field()
  itemPriceSufix!: string;
}

@ObjectType()
export class AddCatalogItemOutput {
  @Field()
  operationId!: string;

  @Field()
  sellerId!: string;

  @Field()
  catalogId!: string;

  @Field()
  itemId!: string;
}

@InputType()
export class AddAssignmentInput {
  @Field()
  operationId!: string;

  @Field()
  sellerId!: string;

  @Field()
  operatorId!: string;

  @Field()
  catalogId!: string;

  @Field()
  role!: string;
}

@ObjectType()
export class AddAssignmentOutput {
  @Field()
  operationId!: string;

  @Field()
  sellerId!: string;

  @Field()
  operatorId!: string;

  @Field()
  catalogId!: string;

  @Field()
  role!: string;
}

@InputType()
export class StartOperationInput {
  @Field()
  operationId!: string;
}

@ObjectType()
export class StartOperationOutput {
  @Field()
  operationId!: string;
}
