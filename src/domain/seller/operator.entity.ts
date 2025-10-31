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
    this._name = _name;
    this._email = _email;
  }

  public static create(id: Uuid, name: string, email: Email): Operator {
    if (!name.trim()) {
      throw new Error("Name cannot be empty");
    }

    return new Operator(id, name, email);
  }

  get name(): string {
    return this._name;
  }

  get email(): Email {
    return this._email;
  }
}
