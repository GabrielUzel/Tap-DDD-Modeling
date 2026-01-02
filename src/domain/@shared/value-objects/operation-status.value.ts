import type { ValueObject } from "../interfaces/value-object.interface";

export type OperationStatusType = "PLANNED" | "ON_GOING" | "FINISHED";

export class OperationStatus implements ValueObject<OperationStatusType> {
  private constructor(private readonly value: OperationStatusType) {}

  static PLANNED = new OperationStatus("PLANNED");
  static ON_GOING = new OperationStatus("ON_GOING");
  static FINISHED = new OperationStatus("FINISHED");

  isPlanned(): boolean {
    return this.value === "PLANNED";
  }

  isOnGoing(): boolean {
    return this.value === "ON_GOING";
  }

  isFinished(): boolean {
    return this.value === "FINISHED";
  }

  getValue(): OperationStatusType {
    return this.value;
  }

  equals(other: this): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  static fromString(status: string): OperationStatus {
    switch ((status ?? "").toUpperCase()) {
      case "PLANNED":
        return OperationStatus.PLANNED;
      case "ON_GOING":
        return OperationStatus.ON_GOING;
      case "FINISHED":
        return OperationStatus.FINISHED;
      default:
        throw new Error("Invalid operation status");
    }
  }
}
