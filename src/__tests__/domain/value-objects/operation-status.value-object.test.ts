import { describe, it, expect } from "bun:test";
import { OperationStatus } from "../../../domain/@shared/value-objects/operation-status.value";

describe("OperationStatus value object tests", () => {
  describe("Factory (fromString)", () => {
    it("Should create PLANNED from 'PLANNED' and 'planned'", () => {
      expect(OperationStatus.fromString("PLANNED").isPlanned()).toBeTrue();
      expect(OperationStatus.fromString("planned").isPlanned()).toBeTrue();
    });

    it("Should create ON_GOING from 'ON_GOING' and 'on_going'", () => {
      expect(OperationStatus.fromString("ON_GOING").isOnGoing()).toBeTrue();
      expect(OperationStatus.fromString("on_going").isOnGoing()).toBeTrue();
    });

    it("Should create FINISHED from 'FINISHED' and 'Finished'", () => {
      expect(OperationStatus.fromString("FINISHED").isFinished()).toBeTrue();
      expect(OperationStatus.fromString("Finished").isFinished()).toBeTrue();
    });

    it("Should throw error for invalid status", () => {
      expect(() => OperationStatus.fromString("paused")).toThrowError(
        "Invalid operation status",
      );
    });
  });
});
