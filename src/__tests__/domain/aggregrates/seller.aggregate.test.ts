import { describe, it, expect } from "bun:test";
import { Seller } from "../../../domain/aggregates/seller.aggregate";
import { Uuid } from "../../../shared/uuid";
import { Email } from "../../../domain/value-objects/email.value";
import { Operator } from "../../../domain/entities/operator.entity";

describe("Seller factory tests", () => {
  it("Should create seller", () => {  
    const seller = Seller.create(Uuid.generate(), "Valid name", Email.create("valid_email@gmail.com"));
    expect(seller).toBeInstanceOf(Seller);
  });

  it("Should throw error, email is invalid", () => {  
    expect(() => Seller.create(Uuid.generate(), "Valid name", Email.create("invalid_emailgmail.com"))).toThrowError("Email format invalid");
  });

  it("Should throw error, name is empty", () => {  
    expect(() => Seller.create(Uuid.generate(), " ", Email.create("valid_email@gmail.com"))).toThrowError("Name cannot be empty");
  });

  it("Should throw error, name is too long", () => {
    const tooLongName = "A".repeat(101);
    expect(() => Seller.create(Uuid.generate(), tooLongName, Email.create("valid_email@gmail.com"))).toThrowError("Name is too long");
  });
});

describe("Add operator tests", () => {
  it("Should add operator successfully", () => {
    const seller = Seller.create(Uuid.generate(), "Valid name", Email.create("valid_email@gmail.com"));
    const operator = Operator.create(Uuid.generate(), "Valid name", Email.create("valid_email@gmail.com"));

    seller.addOperator(operator);
    
    expect(seller.hasOperator(operator.getId())).toBeTrue();
  });

  it("Should throw error, operator already in the pool", () => {
    const seller = Seller.create(Uuid.generate(), "Valid name", Email.create("valid_email@gmail.com"));
    const operator = Operator.create(Uuid.generate(), "Valid name", Email.create("valid_email@gmail.com"));
    
    seller.addOperator(operator);
    
    expect(() => seller.addOperator(operator)).toThrowError("Operator already in the pool");
  });
});
