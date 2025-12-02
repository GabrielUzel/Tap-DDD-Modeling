import { Field, InputType, ObjectType, Int } from "@nestjs/graphql";

// @ObjectType()
// export class OperationType {
//   @Field()
//   operationId!: string;

//   @Field()
//   name!: string;

//   @Field()
//   status!: string;
// }

// @ObjectType()
// export class SellerType {
//   @Field()
//   sellerId!: string;

//   @Field()
//   name!: string;

//   @Field()
//   email!: string;
// }

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

@InputType()
export class AddSellerToOperationInput {
  @Field()
  operationId!: string;

  @Field()
  sellerId!: string;
}

@ObjectType()
export class AddSellerToOperationOutput {
  @Field()
  operationId!: string;

  @Field()
  sellerId!: string;
}

@InputType()
export class CreateCatalogInput {
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
export class CreateCatalogOutput {
  @Field()
  operationId!: string;

  @Field()
  sellerId!: string;

  @Field()
  catalogId!: string;
}

@InputType()
export class CreateCatalogItemInput {
  @Field()
  operationId!: string;

  @Field()
  sellerId!: string;

  @Field()
  catalogId!: string;

  @Field()
  itemName!: string;

  @Field(() => Int)
  itemPriceAmount!: number;

  @Field()
  itemPriceSufix!: string;
}

@ObjectType()
export class CreateCatalogItemOutput {
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
export class CreateAssignmentInput {
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
export class CreateAssignmentOutput {
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

@ObjectType()
export class GetOperationsOutput {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field()
  status!: string;
}

@InputType()
export class GetOperationByIdInput {
  @Field()
  operationId!: string;
}

@ObjectType()
export class GetOperationByIdOutput {
  @Field()
  id!: string;

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
  id!: string;

  @Field()
  name!: string;

  @Field()
  email!: string;
}
