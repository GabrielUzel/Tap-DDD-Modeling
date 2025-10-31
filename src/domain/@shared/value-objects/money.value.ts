import { ValueObject } from "../interfaces/value-object.interface";

export type MoneySufix = "BRL" | "USD";

interface MoneyProps {
  amount: number;
  sufix: MoneySufix;
}

export class Money implements ValueObject<MoneyProps> {
  static readonly BRL: MoneySufix = "BRL";
  static readonly USD: MoneySufix = "USD";
  static readonly values: MoneySufix[] = [Money.BRL, Money.USD];

  constructor(
    private _amount: number,
    private _sufix: MoneySufix,
  ) {
    this._amount = _amount;
    this._sufix = _sufix;
  }

  public static create(amount: number, sufix: MoneySufix): Money {
    if (amount < 0) {
      throw new Error("Value must be greater than zero");
    }

    if (!Money.values.includes(sufix as MoneySufix)) {
      throw new Error("Invalid money suffix");
    }

    return new Money(amount, sufix);
  }

  public getAmount(): number {
    return this._amount;
  }

  public getSufix(): MoneySufix {
    return this._sufix;
  }

  public getValue(): MoneyProps {
    return {
      amount: this._amount,
      sufix: this._sufix,
    };
  }

  public equals(other: this): boolean {
    return this._amount === other._amount && this._sufix === other._sufix;
  }
}
