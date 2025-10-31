import type { ValueObject } from "../interfaces/value-object.interface";

export type StatusType = "planned" | "on_going" | "finished";

export class Status implements ValueObject<StatusType> {
  static readonly PLANNED = new Status("planned");
  static readonly ON_GOING = new Status("on_going");
  static readonly FINISHED = new Status("finished");

  private static readonly VALID_STATUSES = [
    "planned",
    "on_going",
    "finished",
  ] as const;

  private readonly value: StatusType;

  private constructor(value: StatusType) {
    this.value = value;
  }

  static fromString(value: string): Status {
    const lowerValue = value.toLowerCase();

    if (!this.isValid(lowerValue)) {
      throw new Error("Invalid status type");
    }

    switch (lowerValue) {
      case "planned":
        return Status.PLANNED;
      case "on_going":
        return Status.ON_GOING;
      case "finished":
        return Status.FINISHED;
      default:
        throw new Error("Invalid status type");
    }
  }

  private static isValid(value: string): boolean {
    return this.VALID_STATUSES.includes(value as StatusType);
  }

  getValue(): StatusType {
    return this.value;
  }

  equals(other: this): boolean {
    return this.value === other.value;
  }

  isPlanned(): boolean {
    return this === Status.PLANNED;
  }

  isOnGoing(): boolean {
    return this === Status.ON_GOING;
  }

  isFinished(): boolean {
    return this === Status.FINISHED;
  }

  toString(): string {
    return this.value;
  }
}
