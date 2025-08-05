import { ValueObject } from "../../../shared/value-object.abstract";

export type StatusType = "planned" | "on_going" | "finished";

export class Status extends ValueObject<StatusType> {
  constructor(value: StatusType) {
    super(value);
  }

  public getStatus() {
    return this.value;
  }

  public isPlanned() {
    return this.value === "planned";
  }

  public isOnGoing() {
    return this.value === "on_going";
  }

  public isFinished() {
    return this.value === "finished";
  }
}