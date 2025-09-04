import type { Repository } from './@shared/repository.interface';
import { Sale } from '../../domain/aggregates/sale.aggregate';
import { right, left, type Either } from '../../shared/either.protocol';
import type { Uuid } from '../../shared/uuid';

export class SaleRepository implements Repository<Sale> {
  private sales: Sale[] = [];

  async findById(id: Uuid): Promise<Either<Error, Sale>> {
    const sale = this.sales.find(sale => sale.getId().equals(id));

    if (!sale) {
      return left(new Error("Sale not found"));
    }

    return right(sale);
  }

  async save(sale: Sale): Promise<Either<Error, void>> {
    this.sales.push(sale);
    return right(undefined);
  }
}