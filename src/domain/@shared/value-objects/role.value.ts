import type { ValueObject } from "../interfaces/value-object.interface";

export type RoleType = "cashier" | "manager" | "admin" | "stocker";

export class Role implements ValueObject<RoleType> {
  static readonly CASHIER = new Role("cashier");
  static readonly MANAGER = new Role("manager");
  static readonly ADMIN = new Role("admin");
  static readonly STOCKER = new Role("stocker");

  private static readonly VALID_ROLES = [
    "cashier",
    "manager",
    "admin",
    "stocker",
  ] as const;

  private readonly value: RoleType;

  private constructor(value: RoleType) {
    this.value = value;
  }

  static fromString(value: string): Role {
    const lowerValue = value.toLowerCase();

    if (!this.isValid(lowerValue)) {
      throw new Error("Invalid role type");
    }

    switch (lowerValue) {
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

  private static isValid(value: string): boolean {
    return this.VALID_ROLES.includes(value as RoleType);
  }

  getValue(): RoleType {
    return this.value;
  }

  equals(other: this): boolean {
    return this.value === other.value;
  }

  isCashier(): boolean {
    return this === Role.CASHIER;
  }

  isManager(): boolean {
    return this === Role.MANAGER;
  }

  isAdmin(): boolean {
    return this === Role.ADMIN;
  }

  isStocker(): boolean {
    return this === Role.STOCKER;
  }

  toString(): string {
    return this.value;
  }
}
