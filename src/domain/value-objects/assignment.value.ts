import { Role } from "../value-objects/role.value";
import type { ValueObject } from "../../utils/value-object.interface";
import { Uuid } from "../../utils/uuid";

interface AssignmentProps {
  operatorId: Uuid;
  catalogId: Uuid;
  role: Role;
}

export class Assignment implements ValueObject<AssignmentProps> {
  private readonly operatorId: Uuid;
  private readonly catalogId: Uuid;
  private readonly role: Role;

  constructor(operatorId: Uuid, catalogId: Uuid, role: Role) {
    this.operatorId = operatorId;
    this.catalogId = catalogId;
    this.role = role;
  }

  public static create(
    operatorId: Uuid,
    catalogId: Uuid,
    role: Role,
  ): Assignment {
    if (!operatorId) {
      throw new Error("OperatorId cannot be empty");
    }

    if (!catalogId) {
      throw new Error("CatalogId cannot be empty");
    }

    if (!role) {
      throw new Error("Role cannot be empty");
    }

    return new Assignment(operatorId, catalogId, role);
  }

  public getValue(): AssignmentProps {
    return {
      operatorId: this.operatorId,
      catalogId: this.catalogId,
      role: this.role,
    };
  }

  public equals(other: this): boolean {
    return (
      this.operatorId.equals(other.getOperatorId()) &&
      this.catalogId.equals(other.getCatalogId()) &&
      this.role.equals(other.getRole())
    );
  }

  public operatorCanRegisterSale(): boolean {
    return this.role.isCashier();
  }

  public getOperatorId() {
    return this.operatorId;
  }

  public getCatalogId() {
    return this.catalogId;
  }

  public getRole() {
    return this.role;
  }
}
