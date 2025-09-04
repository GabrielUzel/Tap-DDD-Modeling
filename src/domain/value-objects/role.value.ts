import type { ValueObject } from "../../shared/value-object.interface";

export type RoleType = "cashier" | "manager" | "admin";

export class Role implements ValueObject<RoleType> {
  static readonly CASHIER: RoleType = "cashier";
  static readonly MANAGER: RoleType = "manager";
  static readonly ADMIN: RoleType = "admin";
  static readonly values: RoleType[] = [Role.CASHIER, Role.MANAGER, Role.ADMIN];

  private readonly role: RoleType;

  constructor(role: string) {
    if (!Role.values.includes(role as RoleType)) {
      throw new Error("Invalid role type");
    }
    this.role = role as RoleType;
  }

  public getValue(): RoleType {
    return this.role;
  }

  public equals(other: this): boolean {
    return this.role === other.getValue();
  }

  public isCashier(): boolean {
    return this.role === Role.CASHIER;
  }

  public isManager(): boolean {
    return this.role === Role.MANAGER;
  }

  public isAdmin(): boolean {
    return this.role === Role.ADMIN;
  }
}