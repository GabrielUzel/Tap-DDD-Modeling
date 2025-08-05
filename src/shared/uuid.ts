import { v4 as uuid, validate } from 'uuid';
import { ValueObject } from './value-object.abstract';

export class Uuid extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.ensureIsValidUuid(value);
  }

  static generate(): Uuid {
    return new Uuid(uuid());
  }

  private ensureIsValidUuid(id: string): void {
    if(!validate(id)) {
      throw new Error("Invalid uuid format");
    }
  }
}