import type { Repository } from './@shared/repository.interface';
import { CatalogItem } from '../../domain/entities/catalog-item.entity';
import { right, left, type Either } from '../../shared/either.protocol';
import type { Uuid } from '../../shared/uuid';

export class CatalogItemRepository implements Repository<CatalogItem> {
  private catalogItems: CatalogItem[] = [];

  async findById(id: Uuid): Promise<Either<Error, CatalogItem>> {
    const catalogItem = this.catalogItems.find(catalogItem => catalogItem.getId().equals(id));

    if (!catalogItem) {
      return left(new Error("Catalog item not found"));
    }

    return right(catalogItem);
  }

  async save(catalogItem: CatalogItem): Promise<Either<Error, void>> {
    this.catalogItems.push(catalogItem);
    return right(undefined);
  }
}