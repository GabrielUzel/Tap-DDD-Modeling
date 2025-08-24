import { describe, it, expect, beforeEach } from "bun:test";
import { Assignment } from "../../../domain/value-objects/assignment.value";
import { Uuid } from "../../../shared/uuid";
import { Role } from "../../../domain/value-objects/role.value";

describe("Assignment factory tests", () => {
  it("Should create assignment successfully", () => {
    const assignment = Assignment.create(Uuid.generate(), Uuid.generate(), new Role("cashier"));
    expect(assignment).toBeInstanceOf(Assignment);
  });

  it("Should throw error, operator id is empty", () => {
    expect(() => Assignment.create(undefined as any, Uuid.generate(), new Role("cashier"))).toThrowError("OperatorId cannot be empty");
  });

  it("Should throw error, catalog id is empty", () => {
    expect(() => Assignment.create(Uuid.generate(), undefined as any, new Role("cashier"))).toThrowError("CatalogId cannot be empty");
  });

  it("Should throw error, role is empty", () => {
    expect(() => Assignment.create(Uuid.generate(), Uuid.generate(), undefined as any)).toThrowError("Role cannot be empty");
  });
});