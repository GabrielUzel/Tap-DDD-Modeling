import { ValueObject } from "../../../shared/value-object.abstract";

// TODO: Criar mais roles
export type RoleType = "cashier"

export class Role extends ValueObject<RoleType> {
  constructor(value: RoleType) {
    super(value);
  }

  public getRole() {
    return this.value;
  }

  public isCashier() {
    return this.value === "cashier";
  }
}