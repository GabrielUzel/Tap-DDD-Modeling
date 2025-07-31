import { AggregateRoot } from "../../shared/aggregate-root.abstract";
import type { Uuid } from "../../shared/uuid";
import type { Email } from "../value-objects/email.value";

export class Seller extends AggregateRoot {
  private operators_ids: Uuid[] = [];
  private name: string;
  private email: Email;

  constructor(id: Uuid, name: string, email: Email) {
    super(id);
    this.name = name;
    this.email = email;
  }

  public static create(id: Uuid, name: string, email: Email) {
    if(!name.trim()) {
      throw new Error("Name cannot be empty");
    }

    if(name.length > 100) {
      throw new Error("Name is too long");
    }

    return new Seller(id, name, email);
  }

  public addOperator(operatorId: Uuid) {
    // Adicionar operator de confiança ao seu pool
    // Verificar se o operator já faz parte do seu pool
  }

  public hasOperator(operatorId: Uuid) {
    // Encontrar operator pelo seu id
  }
}