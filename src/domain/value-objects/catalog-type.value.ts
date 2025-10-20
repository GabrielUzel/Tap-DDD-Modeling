export type CatalogTypeOptions = "lounge" | "general";

export class CatalogType {
  static readonly LOUNGE: CatalogTypeOptions = "lounge";
  static readonly GENERAL: CatalogTypeOptions = "general";
  static readonly values: CatalogTypeOptions[] = [
    CatalogType.LOUNGE,
    CatalogType.GENERAL,
  ];

  private readonly catalogType: CatalogTypeOptions;

  constructor(catalogType: string) {
    if (!CatalogType.values.includes(catalogType as CatalogTypeOptions)) {
      throw new Error("Invalid catalog type");
    }

    this.catalogType = catalogType as CatalogTypeOptions;
  }

  public getValue(): CatalogTypeOptions {
    return this.catalogType;
  }

  public equals(other: CatalogType): boolean {
    return this.catalogType === other.getValue();
  }

  public isLounge(): boolean {
    return this.catalogType === CatalogType.LOUNGE;
  }

  public isGeneral(): boolean {
    return this.catalogType === CatalogType.GENERAL;
  }
}
