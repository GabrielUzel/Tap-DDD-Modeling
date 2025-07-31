export abstract class ValueObject<T> {
  protected readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  public equals(other: ValueObject<T>): boolean {
    return JSON.stringify(this.value) === JSON.stringify(other.value);
  }

  public getValue(): T {
    return this.value;
  }
}