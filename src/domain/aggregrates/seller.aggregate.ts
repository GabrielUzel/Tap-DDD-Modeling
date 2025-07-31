import { AggregateRoot } from "../../shared/aggregate-root.abstract";
import type { Uuid } from "../../shared/uuid";
import type { Email } from "../value-objects/email.value";

export class Seller extends AggregateRoot {
  private operators_ids: Uuid[] = [];
  private name: string;
  private email: Email;

  constructor(id: Uuid, name: string, email: Email) {
    super(id);
    this.name = name;
    this.email = email;
  }

  public static create(id: Uuid, name: string, email: Email) {
    if(!name.trim()) {
      throw new Error("Name cannot be empty");
    }

    if(name.length > 100) {
      throw new Error("Name is too long");
    }

    return new Seller(id, name, email);
  }

  public addOperator(operatorId: Uuid): void {
    if(this.hasOperator(operatorId)) {
      throw new Error("Operator already in the pool");
    }

    this.operators_ids.push(operatorId);
  }

  public hasOperator(operatorId: Uuid): boolean {
    return this.operators_ids.includes(operatorId);
  }
}