import { ValueObject } from "../../shared/value-object.abstract";

export type MoneySufix = "BRL";

interface MoneyProps {
  amount: number;
  sufix: MoneySufix;
}

export class Money extends ValueObject<MoneyProps> {
  constructor(props: MoneyProps) {
    super(props);
  }

  public static create(amount: number, sufix: MoneySufix): Money {
    if(amount < 0) {
      throw new Error("Value must be greater than zero");
    }

    return new Money({ amount, sufix });
  }

  public getAmount(): number {
    return this.value.amount;
  }
}