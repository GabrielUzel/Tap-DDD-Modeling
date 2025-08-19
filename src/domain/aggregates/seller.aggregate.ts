import { AggregateRoot } from "../../shared/aggregate-root.abstract";
import type { Uuid } from "../../shared/uuid";
import type { Operator } from "./entities/operator.entity";
import type { Email } from "../value-objects/email.value";

export class Seller extends AggregateRoot {
  private operators: Operator[] = [];
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

  public addOperator(operator: Operator): void {
    if(this.hasOperator(operator.getId())) {
      throw new Error("Operator already in the pool");
    }

    this.operators.push(operator);
  }

  public hasOperator(operatorId: Uuid): boolean {
    return this.operators.some(operator => operator.getId().equals(operatorId));
  }
}
