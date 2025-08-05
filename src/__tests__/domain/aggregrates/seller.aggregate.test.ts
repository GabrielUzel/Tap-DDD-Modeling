import { describe, it, expect } from "bun:test";
import { Seller } from "../../../domain/seller/seller.aggregate";
import { Uuid } from "../../../shared/uuid";
import { Email } from "../../../domain/seller/value-objects/email.value";
import { Operator } from "../../../domain/seller/entities/operator.entity";

describe("Testes seller factory", () => {
  it("Seller criado", () => {  
    const seller = Seller.create(Uuid.generate(), "Valid name", Email.create("valid_email@gmail.com"));
    expect(seller).toBeInstanceOf(Seller);
  });

  it("Id passado é inválido", () => {  
    expect(() => Seller.create(new Uuid("Invalid id"), "Valid name", Email.create("valid_emailgmail.com"))).toThrowError("Invalid uuid format");
  });

  it("Email está em um formato inválido", () => {  
    expect(() => Seller.create(Uuid.generate(), "Valid name", Email.create("invalid_emailgmail.com"))).toThrowError("Email format invalid");
  });

  it("Nome está vazio", () => {  
    expect(() => Seller.create(Uuid.generate(), " ", Email.create("valid_email@gmail.com"))).toThrowError("Name cannot be empty");
  });

  it("Nome é muito longo", () => {
    const tooLongName = "A".repeat(101);
    expect(() => Seller.create(Uuid.generate(), tooLongName, Email.create("valid_email@gmail.com"))).toThrowError("Name is too long");
  });
});

describe("Testes addOperator", () => {
  it("Operator adicionado com sucesso", () => {
    const seller = Seller.create(Uuid.generate(), "Valid name", Email.create("valid_email@gmail.com"));
    const operator = Operator.create(Uuid.generate(), "Valid name", Email.create("valid_email@gmail.com"));

    seller.addOperator(operator);
    
    expect(seller.hasOperator(operator.getId())).toBeTrue();
  });

  it("Operator já estava previamente na pool", () => {
    const seller = Seller.create(Uuid.generate(), "Valid name", Email.create("valid_email@gmail.com"));
    const operator = Operator.create(Uuid.generate(), "Valid name", Email.create("valid_email@gmail.com"));
    seller.addOperator(operator);
    
    expect(() => seller.addOperator(operator)).toThrowError("Operator already in the pool");
  });
});
