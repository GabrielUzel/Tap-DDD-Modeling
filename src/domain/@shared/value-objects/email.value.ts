import { ValueObject } from "../interfaces/value-object.interface";

export class Email implements ValueObject<string> {
  constructor(private _email: string) {
    this._email = _email;
  }

  public static create(email: string): Email {
    if (!email) {
      throw new Error("Email cannot be empty");
    }

    if (!this.emailIsValid(email)) {
      throw new Error("Email format invalid");
    }

    return new Email(email);
  }

  private static emailIsValid(email: string): boolean {
    const regex = new RegExp("[a-z0-9]+@[a-z]+\.[a-z]{2,3}");

    return regex.test(email);
  }

  public getValue(): string {
    return this._email;
  }

  public equals(other: this): boolean {
    return this._email === other.getValue();
  }
}
