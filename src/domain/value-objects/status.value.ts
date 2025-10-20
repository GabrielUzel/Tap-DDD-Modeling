import type { ValueObject } from "../../utils/value-object.interface";

export type StatusType = "planned" | "on_going" | "finished";

export class Status implements ValueObject<StatusType> {
  static readonly PLANNED: StatusType = "planned";
  static readonly ON_GOING: StatusType = "on_going";
  static readonly FINISHED: StatusType = "finished";
  static readonly values: StatusType[] = [
    Status.PLANNED,
    Status.ON_GOING,
    Status.FINISHED,
  ];

  private readonly status: StatusType;

  constructor(status: string) {
    if (!Status.values.includes(status as StatusType)) {
      throw new Error("Invalid status type");
    }
    this.status = status as StatusType;
  }

  public getValue(): StatusType {
    return this.status;
  }

  public equals(other: this): boolean {
    return this.status === other.getValue();
  }

  public isPlanned(): boolean {
    return this.status === Status.PLANNED;
  }

  public isOnGoing(): boolean {
    return this.status === Status.ON_GOING;
  }

  public isFinished(): boolean {
    return this.status === Status.FINISHED;
  }
}
