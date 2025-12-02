import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, NotFoundException } from "@nestjs/common";
import type { ISellerRepository } from "src/infrastructure/repositories/interfaces/seller-repository.interface";
import { AddOperatorToSellerPoolCommand } from "./dtos/add-operator-to-seller-pool.command";
import { Operator } from "src/domain/seller/operator.entity";
import { Email } from "src/domain/@shared/value-objects/email.value";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

@CommandHandler(AddOperatorToSellerPoolCommand)
export class AddOperatorToSellerPoolHandler
  implements ICommandHandler<AddOperatorToSellerPoolCommand>
{
  constructor(
    @Inject("SellerRepository")
    private readonly sellerRepository: ISellerRepository,
  ) {}

  async execute(
    command: AddOperatorToSellerPoolCommand,
  ): Promise<{ sellerId: string; operatorId: string }> {
    const sellerId = new Uuid(command.sellerId);
    const seller = await this.sellerRepository.findById(sellerId);

    if (!seller) {
      throw new NotFoundException("Seller not found");
    }

    const operator = Operator.create(
      Uuid.generate(),
      command.operatorName,
      Email.create(command.operatorEmail),
    );

    seller.addOperatorToPool(operator);
    await this.sellerRepository.save(seller);

    return {
      sellerId: sellerId.getValue(),
      operatorId: operator.getId().getValue(),
    };
  }
}
