import type { ValueObject } from "../interfaces/value-object.interface";

export type CatalogTypeOptions = "LOUNGE" | "GENERAL";

export class CatalogType implements ValueObject<CatalogTypeOptions> {
  private constructor(private readonly value: CatalogTypeOptions) {}

  static readonly LOUNGE = new CatalogType("LOUNGE");
  static readonly GENERAL = new CatalogType("GENERAL");

  isLounge(): boolean {
    return this.value === "LOUNGE";
  }

  isGeneral(): boolean {
    return this.value === "GENERAL";
  }

  getValue(): CatalogTypeOptions {
    return this.value;
  }

  equals(other: this): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  static fromString(value: string): CatalogType {
    switch ((value ?? "").toLowerCase()) {
      case "lounge":
        return CatalogType.LOUNGE;
      case "general":
        return CatalogType.GENERAL;
      default:
        throw new Error("Invalid catalog type");
    }
  }
}
