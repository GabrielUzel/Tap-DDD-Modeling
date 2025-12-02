import { ValueObject } from "../interfaces/value-object.interface";
import { Role } from "../value-objects/role.value";
import { Uuid } from "../interfaces/uuid";

interface AssignmentProps {
  operatorId: Uuid;
  catalogId: Uuid;
  role: Role;
}

export class Assignment implements ValueObject<AssignmentProps> {
  constructor(
    private _operatorId: Uuid,
    private _catalogId: Uuid,
    private _role: Role,
  ) {
    this._operatorId = _operatorId;
    this._catalogId = _catalogId;
    this._role = _role;
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
      operatorId: this._operatorId,
      catalogId: this._catalogId,
      role: this._role,
    };
  }

  public equals(other: this): boolean {
    return (
      this._operatorId.equals(other.operatorId) &&
      this._catalogId.equals(other.catalogId) &&
      this._role.equals(other.role)
    );
  }

  public operatorCanRegisterSale(): boolean {
    return this._role.isCashier();
  }

  public static fromJSON(json: {
    operatorId: string;
    catalogId: string;
    role: string;
  }): Assignment {
    const operatorId = new Uuid(json.operatorId);
    const catalogId = new Uuid(json.catalogId);
    const role = Role.fromString(json.role);

    return new Assignment(operatorId, catalogId, role);
  }

  get operatorId(): Uuid {
    return this._operatorId;
  }

  get catalogId(): Uuid {
    return this._catalogId;
  }

  get role(): Role {
    return this._role;
  }
}
