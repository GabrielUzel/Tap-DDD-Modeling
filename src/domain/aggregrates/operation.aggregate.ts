import { Uuid } from "../../shared/uuid";
import { Status } from "../value-objects/status.value";
import { Role } from "../value-objects/role.value";
import { AggregateRoot } from "../../shared/aggregate-root.abstract";
import { SaleItem } from "../value-objects/sale-item.value";
import type { Assignment } from "../value-objects/assignment.value";

export class Operation extends AggregateRoot {
  private status: Status;
  private catalogs_ids: Uuid[] = []
  private assignments: Assignment[] = [];

  constructor(id: Uuid, status: Status) {
    super(id);
    this.status = status;
  }

  public static create(id: Uuid): Operation {
    const initialStatus: Status = new Status("planned");
    return new Operation(id, initialStatus);
  }

  public addCatalog(catalogId: Uuid) {
    // Adicionar um catálogo dentro da operation
  }

  public startOperation() {
    // Ativar a operação para começar as vendas
    // Verificar se há pelo menos 1 catalogo que tenha pelo menos 1 item
  }

  public assignOperator(operatorId: Uuid, catalogId: Uuid, role: Role) {
    // Atribuir um operator do pool para trabalhar em um catalog específico
    // Verificar se os valores são válidos
    // Verificar se o operator está na pool do seller
    // Verificar se o catalog faz parte da operation
  }

  public registerSale(operatorId: Uuid, catalogId: Uuid, items: SaleItem[]) {
    // Registro da venda
    // Verificar se os valores são válidos
    // Verificar se a operation está "on_going"
    // Verificar se o operator está atribuído a essa operation 
    // Verificar se o operator está vinculado a este catalog
    // Verificar se o operator tem a role correta
  }
}