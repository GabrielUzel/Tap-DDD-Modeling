import type { Repository } from './@shared/repository.interface';
import { Seller } from '../../domain/aggregates/seller.aggregate';
import { right, left, type Either } from '../../shared/either.protocol';
import type { Uuid } from '../../shared/uuid';

export class SellerRepository implements Repository<Seller> {
  private sellers: Seller[] = [];

  async findById(id: Uuid): Promise<Either<Error, Seller>> {
    const seller = this.sellers.find(seller => seller.getId().equals(id));

    if (!seller) {
      return left(new Error("Seller not found"));
    }

    return right(seller);
  }

  async save(seller: Seller): Promise<Either<Error, void>> {
    this.sellers.push(seller);
    return right(undefined);
  }
}