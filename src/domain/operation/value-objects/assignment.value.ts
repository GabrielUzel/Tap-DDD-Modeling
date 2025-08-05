import { Role } from "../value-objects/role.value";
import { ValueObject } from "../../../shared/value-object.abstract";
import { Uuid } from "../../../shared/uuid";

interface AssignmentProps {
  operatorId: Uuid;
  catalogId: Uuid;
  role: Role;
}

export class Assignment extends ValueObject<AssignmentProps> {
  constructor(props: AssignmentProps) {
    super(props);
  }

  public static create(operatorId: Uuid, catalogId: Uuid, role: Role): Assignment {
    if(!operatorId) {
      throw new Error("OperatorId cannot be empty");
    }

    if(!catalogId) {
      throw new Error("CatalogId cannot be empty");
    }

    if(!role) {
      throw new Error("Role cannot be empty");
    }

    return new Assignment({ operatorId, catalogId, role });
  }

  public operatorCanRegisterSale(): boolean {
    return this.value.role.isCashier();
  }

  public getOperatorId() {
    return this.value.operatorId;
  }

  public getCatalogId() {
    return this.value.catalogId;
  }
}