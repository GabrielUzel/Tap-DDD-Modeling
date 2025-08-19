import type { ValueObject } from "../../shared/value-object.interface";

export type CatalogTypeOptions = "lounge" | "general"

export class CatalogType implements ValueObject<CatalogTypeOptions> {
  private catalogType: CatalogTypeOptions

  constructor(catalogType: CatalogTypeOptions) {
    this.catalogType = catalogType;
  }

  public getValue() {
    return this.catalogType;
  }

  public equals(other: this): boolean {
    return this.catalogType === other.getValue();
  }

  public isLounge() {
    return this.catalogType === "lounge";
  }

  public isGeneral() {
    return this.catalogType === "general";
  }
}