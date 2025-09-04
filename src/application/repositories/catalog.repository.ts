import type { Repository } from './@shared/repository.interface';
import { Catalog } from '../../domain/entities/catalog.entity';
import { right, left, type Either } from '../../shared/either.protocol';
import type { Uuid } from '../../shared/uuid';

export class CatalogRepository implements Repository<Catalog> {
  private catalogs: Catalog[] = [];

  async findById(id: Uuid): Promise<Either<Error, Catalog>> {
    const catalog = this.catalogs.find(catalog => catalog.getId().equals(id));

    if (!catalog) {
      return left(new Error("Catalog not found"));
    }

    return right(catalog);
  }

  async save(catalog: Catalog): Promise<Either<Error, void>> {
    this.catalogs.push(catalog);
    return right(undefined);
  }
}