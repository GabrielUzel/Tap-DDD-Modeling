import { Entity } from "../../shared/entity.abstract";
import type { Uuid } from "../../shared/uuid";

export class Catalog extends Entity {
  private name: string;
  private catalogItemsIds: Uuid[] = [];

  constructor(id: Uuid, name: string) {
    super(id);
    this.name = name;
  }

  public static create(id: Uuid, name: string): Catalog {
    if(!name.trim()) {
      throw new Error("Name cannot be empty");
    }

    return new Catalog(id, name);
  }

  // ! Dúvida
  /* 
    Na descrição do projeto, uma das resposabilidades do operation era
    adicionar um item a um catálogo específico, porém, isto vai de encontro 
    com a ideia de encapsulamento. Não é papel do operation modificar 
    valores de catalog. Isso não deveria ser feito em uma camada acima de 
    domínio? Onde será verificado que um catalog faz parte de uma operation 
    (dados ids de operation e catalog), assim, dentro deste catalog, faz esta
    operação abaixo.
  */ 
  public addItem(catalogItemId: Uuid) {
    this.catalogItemsIds.push(catalogItemId);
  }
}