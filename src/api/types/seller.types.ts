import { Field, InputType, ObjectType, Float } from "@nestjs/graphql";

@ObjectType()
export class OperatorType {
  @Field()
  operatorId!: string;

  @Field()
  operatorName!: string;

  @Field()
  operatorEmail!: string;
}

@ObjectType()
export class CatalogItemType {
  @Field()
  itemId!: string;

  @Field()
  itemName!: string;

  @Field(() => Float)
  itemPrice!: number;
}

@ObjectType()
export class CatalogType {
  @Field()
  catalogId!: string;

  @Field()
  catalogName!: string;

  @Field()
  catalogType!: string;

  @Field(() => [CatalogItemType])
  items!: CatalogItemType[];
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
export class GetSellerInput {
  @Field()
  sellerId!: string;
}

@ObjectType()
export class GetSellerOutput {
  @Field()
  sellerId!: string;

  @Field()
  name!: string;

  @Field()
  email!: string;
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
  @Field(() => [OperatorType])
  operators!: OperatorType[];
}

@InputType()
export class GetCatalogInput {
  @Field()
  sellerId!: string;

  @Field()
  catalogId!: string;
}

@ObjectType()
export class GetCatalogOutput {
  @Field(() => CatalogType)
  catalog!: CatalogType;
}

@InputType()
export class UpdateCatalogItemInput {
  @Field()
  itemId!: string;

  @Field()
  itemName!: string;

  @Field(() => Float)
  itemPrice!: number;
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

  @Field(() => [UpdateCatalogItemInput], { nullable: true })
  items?: UpdateCatalogItemInput[];
}

@ObjectType()
export class UpdateCatalogOutput {
  @Field()
  sellerId!: string;
}
