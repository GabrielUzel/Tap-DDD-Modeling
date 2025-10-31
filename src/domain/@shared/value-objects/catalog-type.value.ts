import type { ValueObject } from "../interfaces/value-object.interface";

export type CatalogTypeOptions = "lounge" | "general";

export class CatalogType implements ValueObject<CatalogTypeOptions> {
  static readonly LOUNGE = new CatalogType("lounge");
  static readonly GENERAL = new CatalogType("general");

  private static readonly VALID_TYPES = ["lounge", "general"] as const;

  private readonly value: CatalogTypeOptions;

  private constructor(value: CatalogTypeOptions) {
    this.value = value;
  }

  static fromString(value: string): CatalogType {
    const lowerValue = value.toLowerCase();

    if (!this.isValid(lowerValue)) {
      throw new Error("Invalid catalog type");
    }

    switch (lowerValue) {
      case "lounge":
        return CatalogType.LOUNGE;
      case "general":
        return CatalogType.GENERAL;
      default:
        throw new Error("Invalid catalog type");
    }
  }

  private static isValid(value: string): boolean {
    return this.VALID_TYPES.includes(value as CatalogTypeOptions);
  }

  getValue(): CatalogTypeOptions {
    return this.value;
  }

  equals(other: this): boolean {
    return this.value === other.value;
  }

  isLounge(): boolean {
    return this === CatalogType.LOUNGE;
  }

  isGeneral(): boolean {
    return this === CatalogType.GENERAL;
  }

  toString(): string {
    return this.value;
  }
}
