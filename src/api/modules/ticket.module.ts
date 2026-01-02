import { Module } from "@nestjs/common";
import { TicketResolver } from "../resolvers/ticket.resolver";
import { ApplicationModule } from "src/application/application.module";

@Module({
  imports: [ApplicationModule],
  providers: [TicketResolver],
})
export class TicketModule {}
