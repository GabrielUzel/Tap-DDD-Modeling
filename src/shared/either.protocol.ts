type Left<T> = {
  left: T;
  right?: never;
};

type Right<T> = {
  left?: never;
  right: T;
};

export type Either<T, U> = NonNullable<Left<T> | Right<U>>;

export const isLeft = <T, U>(e: Either<T, U>): e is Left<T> => {
  return e.left !== undefined;
};

export const isRight = <T, U>(e: Either<T, U>): e is Right<U> => {
  return e.right !== undefined;
};

export const left = <T>(value: T): Left<T> => ({ left: value });

export const right = <U>(value: U): Right<U> => ({ right: value });

export function getLeft<T, U>(either: Either<T, U>): T | undefined {
  return either.left;
}

export function getRight<T, U>(either: Either<T, U>): U | undefined {
  return either.right;
}