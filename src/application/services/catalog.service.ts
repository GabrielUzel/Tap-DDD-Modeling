import type {
  CreateCatalogInput,
  CreateCatalogOutput,
} from "../dtos/catalog/create-catalog.dto";
import { Uuid } from "../../utils/uuid";
import { Catalog } from "../../domain/entities/catalog.entity";
import {
  CatalogType,
  type CatalogTypeOptions,
} from "../../domain/value-objects/catalog-type.value";
import { CatalogRepository } from "../repositories/catalog.repository";
import { isLeft, left, right, type Either } from "../../utils/either.protocol";

export class CatalogService {
  private catalogRepository: CatalogRepository;

  constructor(catalogRepository: CatalogRepository) {
    this.catalogRepository = catalogRepository;
  }

  public async createCatalog(
    input: CreateCatalogInput,
  ): Promise<Either<Error, CreateCatalogOutput>> {
    try {
      const catalogType = new CatalogType(
        input.catalogType as CatalogTypeOptions,
      );
      const catalog = Catalog.create(Uuid.generate(), input.name, catalogType);
      await this.catalogRepository.save(catalog);

      return right({
        catalogId: catalog.getId().getValue(),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return left(new Error(error.message));
      }

      return left(new Error("An unknown error occurred"));
    }
  }
}
