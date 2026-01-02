import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { OperationModule } from "./modules/operation.module";
import { SellerModule } from "./modules/seller.module";
import { SaleModule } from "./modules/sale.module";
import { TicketModule } from "./modules/ticket.module";
import { join } from "path";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      sortSchema: true,
      playground: true,
      context: ({ req, res }) => ({ req, res }),
      buildSchemaOptions: {
        dateScalarMode: "timestamp",
      },
      autoTransformHttpErrors: true,
    }),
    OperationModule,
    SellerModule,
    SaleModule,
    TicketModule,
  ],
})
export class AppModule {}
