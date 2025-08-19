import type { ValueObject } from "../../shared/value-object.interface";

export type RoleType = "cashier" | "manager" | "admin";

export class Role implements ValueObject<RoleType> {
  private role: RoleType;

  constructor(role: RoleType) {
    this.role = role;
  }

  public getValue() {
    return this.role;
  }

  public equals(other: this): boolean {
    return this.role === other.getValue();
  }

  public isCashier() {
    return this.role === "cashier";
  }

  public isManager() {
    return this.role === "manager";
  }

  public isAdmin() {
    return this.role === "admin";
  }
}
