import { ValueObject } from "../../../shared/value-object.abstract";

export class Email extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  public static create(email: string): Email {
    if(!email) {
      throw new Error("Email cannot be empty");
    }
    
    if(!this.emailIsValid(email)) {
      throw new Error("Email format invalid");
    }

    return new Email(email);
  }

  private static emailIsValid(email: string): boolean {
    const regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');

    return regex.test(email);
  }
}