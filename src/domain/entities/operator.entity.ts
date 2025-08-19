import { Entity } from "../../../shared/entity.abstract";
import { Uuid } from "../../../shared/uuid";
import type { Email } from "../value-objects/email.value";

export class Operator extends Entity {
  private name: string;
  private email: Email;

  constructor(id: Uuid, name: string, email: Email) {
    super(id);
    this.name = name;
    this.email = email;
  }

  public static create(id: Uuid, name: string, email: Email): Operator {
    if(!name.trim()) {
      throw new Error("Name cannot be empty");
    }

    return new Operator(id, name, email);
  }
}