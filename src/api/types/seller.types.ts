import { Field, InputType, ObjectType, Int } from "@nestjs/graphql";

@ObjectType()
export class CatalogItemType {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field(() => Int)
  priceAmountInCents!: number;

  @Field()
  priceSuffix!: string;
}

@InputType()
export class CreateSellerInput {
  @Field()
  name!: string;

  @Field()
  email!: string;
}

@ObjectType()
export class CreateSellerOutput {
  @Field()
  sellerId!: string;
}

@InputType()
export class AddOperatorToSellerPoolInput {
  @Field()
  sellerId!: string;

  @Field()
  operatorName!: string;

  @Field()
  operatorEmail!: string;
}

@ObjectType()
export class AddOperatorToSellerPoolOutput {
  @Field()
  sellerId!: string;

  @Field()
  operatorId!: string;
}

@InputType()
export class UpdateCatalogInput {
  @Field()
  sellerId!: string;

  @Field()
  catalogId!: string;

  @Field({ nullable: true })
  catalogName?: string;

  @Field({ nullable: true })
  catalogType?: string;
}

@ObjectType()
export class UpdateCatalogOutput {
  @Field()
  catalogId!: string;
}

@InputType()
export class GetSellerByIdInput {
  @Field()
  sellerId!: string;
}

@ObjectType()
export class GetSellerByIdOutput {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field()
  email!: string;
}

@InputType()
export class SellerHasOperatorInput {
  @Field()
  sellerId!: string;

  @Field()
  operatorId!: string;
}

@ObjectType()
export class SellerHasOperatorOutput {
  @Field()
  hasOperator!: boolean;
}

@InputType()
export class GetOperatorsInput {
  @Field()
  sellerId!: string;
}

@ObjectType()
export class GetOperatorsOutput {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field()
  email!: string;
}

@InputType()
export class GetCatalogByIdInput {
  @Field()
  sellerId!: string;

  @Field()
  catalogId!: string;
}

@ObjectType()
export class GetCatalogByIdOutput {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field()
  type!: string;

  @Field(() => [CatalogItemType])
  items!: CatalogItemType[];
}

@InputType()
export class RemoveCatalogItemFromCatalogInput {
  @Field()
  sellerId!: string;

  @Field()
  catalogId!: string;

  @Field()
  itemId!: string;
}

@ObjectType()
export class RemoveCatalogItemFromCatalogOutput {
  @Field()
  catalogId!: string;

  @Field()
  itemId!: string;
}
