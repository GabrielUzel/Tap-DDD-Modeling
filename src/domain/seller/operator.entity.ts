import { Entity } from "../@shared/interfaces/entity.abstract";
import { Email } from "../@shared/value-objects/email.value";
import { Uuid } from "../@shared/interfaces/uuid";

export class Operator extends Entity {
  constructor(
    id: Uuid,
    private _name: string,
    private _email: Email,
  ) {
    super(id);
  }

  static create(id: Uuid, name: string, email: Email): Operator {
    if (!name.trim()) {
      throw new Error("Name cannot be empty");
    }

    return new Operator(id, name, email);
  }

  static fromJSON(json: { id: string; name: string; email: string }): Operator {
    const id = new Uuid(json.id);
    const name = json.name;
    const email = new Email(json.email);

    return new Operator(id, name, email);
  }

  get name(): string {
    return this._name;
  }

  get email(): Email {
    return this._email;
  }
}
