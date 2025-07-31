import { Entity } from "./entity.abstract";
import type { Uuid } from "./uuid";

// TODO: Definir uma interface para enventos de domínio
export abstract class AggregateRoot extends Entity {
  constructor(id: Uuid) {
    super(id);
  }
}