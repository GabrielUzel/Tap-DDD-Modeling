import type { ValueObject } from "../../shared/value-object.interface";

export type StatusType = "planned" | "on_going" | "finished";

export class Status implements ValueObject<StatusType> {
  private status: StatusType;

  constructor(status: StatusType) {
    this.status = status;
  }

  public getValue(): StatusType {
    return this.status;
  }

  public equals(other: this): boolean {
    return this.status === other.getValue();
  }

  public isPlanned() {
    return this.status === "planned";
  }

  public isOnGoing() {
    return this.status === "on_going";
  }

  public isFinished() {
    return this.status === "finished";
  }
}