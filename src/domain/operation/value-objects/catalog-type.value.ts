import { ValueObject } from "../../../shared/value-object.abstract";

export type CatalogTypeOptions = "camarote" | "pista"

export class CatalogType extends ValueObject<CatalogTypeOptions> {
  constructor(value: CatalogTypeOptions) {
    super(value);
  }

  public getCatalogType() {
    return this.value;
  }

  public isCamarote() {
    return this.value === "camarote";
  }

  public isPista() {
    return this.value === "pista";
  }
}