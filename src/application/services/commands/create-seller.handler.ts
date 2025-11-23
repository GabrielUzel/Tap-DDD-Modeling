import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import type { ISellerRepository } from "src/infrastructure/repositories/interfaces/seller-repository.interface";
import { Seller } from "src/domain/seller/seller.aggregate";
import { Email } from "src/domain/@shared/value-objects/email.value";
import { Uuid } from "src/domain/@shared/interfaces/uuid";
import { CreateSellerCommand } from "./dtos/create-seller.command";

@CommandHandler(CreateSellerCommand)
export class CreateSellerHandler
  implements ICommandHandler<CreateSellerCommand, { sellerId: string }>
{
  constructor(
    @Inject("SellerRepository")
    private readonly sellerRepository: ISellerRepository,
  ) {}

  async execute(command: CreateSellerCommand): Promise<{ sellerId: string }> {
    const seller = Seller.create(
      Uuid.generate(),
      command.name,
      Email.create(command.email),
    );

    await this.sellerRepository.save(seller);

    return { sellerId: seller.getId().getValue() };
  }
}
