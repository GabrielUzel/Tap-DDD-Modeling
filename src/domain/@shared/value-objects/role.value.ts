import type { ValueObject } from "../interfaces/value-object.interface";

export type RoleType = "cashier" | "manager" | "admin" | "stocker";

export class Role implements ValueObject<RoleType> {
  private constructor(private readonly value: RoleType) {}

  static readonly CASHIER = new Role("cashier");
  static readonly MANAGER = new Role("manager");
  static readonly ADMIN = new Role("admin");
  static readonly STOCKER = new Role("stocker");

  isCashier(): boolean {
    return this.value === "cashier";
  }

  isManager(): boolean {
    return this.value === "manager";
  }

  isAdmin(): boolean {
    return this.value === "admin";
  }

  isStocker(): boolean {
    return this.value === "stocker";
  }

  getValue(): RoleType {
    return this.value;
  }

  equals(other: this): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  static fromString(value: string): Role {
    switch ((value ?? "").toLowerCase()) {
      case "cashier":
        return Role.CASHIER;
      case "manager":
        return Role.MANAGER;
      case "admin":
        return Role.ADMIN;
      case "stocker":
        return Role.STOCKER;
      default:
        throw new Error("Invalid role type");
    }
  }
}
