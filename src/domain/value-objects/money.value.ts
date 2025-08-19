import type { ValueObject } from "../../shared/value-object.interface";

export type MoneySufix = "BRL" | "USD";

interface MoneyProps {
  amount: number;
  sufix: MoneySufix;
}

export class Money implements ValueObject<MoneyProps> {
  private readonly amount: number;
  private readonly sufix: MoneySufix;

  constructor(props: MoneyProps) {
    this.amount = props.amount;
    this.sufix = props.sufix;
  }

  public static create(amount: number, sufix: MoneySufix): Money {
    if(amount < 0) {
      throw new Error("Value must be greater than zero");
    }

    return new Money({ amount, sufix });
  }

  public getAmount(): number {
    return this.amount;
  }

  public getSufix(): MoneySufix {
    return this.sufix;
  }

  public getValue(): MoneyProps {
    return {
      amount: this.amount,
      sufix: this.sufix
    };
  }

  public equals(other: this): boolean {
    return this.amount === other.amount && this.sufix === other.sufix;
  }
}