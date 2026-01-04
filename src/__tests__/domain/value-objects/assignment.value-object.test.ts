import { describe, it, expect } from "bun:test";
import { Assignment } from "../../../domain/@shared/value-objects/assignment.value";
import { Uuid } from "../../../domain/@shared/interfaces/uuid";
import { Role } from "../../../domain/@shared/value-objects/role.value";

describe("Assignment value object tests", () => {
  const validOperatorId = Uuid.generate();
  const validCatalogId = Uuid.generate();
  const validRole = Role.CASHIER;

  describe("Factory (create)", () => {
    it("Should create assignment successfully", () => {
      const assignment = Assignment.create(
        validOperatorId,
        validCatalogId,
        validRole,
      );

      expect(assignment).toBeInstanceOf(Assignment);
      expect(assignment.operatorId.equals(validOperatorId)).toBeTrue();
      expect(assignment.catalogId.equals(validCatalogId)).toBeTrue();
      expect(assignment.role.equals(validRole)).toBeTrue();
    });

    it("Should throw error, operator id is empty", () => {
      expect(() =>
        Assignment.create(undefined as any, validCatalogId, validRole),
      ).toThrowError("OperatorId cannot be empty");
    });

    it("Should throw error, catalog id is empty", () => {
      expect(() =>
        Assignment.create(validOperatorId, undefined as any, validRole),
      ).toThrowError("CatalogId cannot be empty");
    });

    it("Should throw error, role is empty", () => {
      expect(() =>
        Assignment.create(validOperatorId, validCatalogId, undefined as any),
      ).toThrowError("Role cannot be empty");
    });
  });

  describe("Methods", () => {
    it("operatorCanRegisterSale should return true for cashier role", () => {
      const assignment = Assignment.create(
        validOperatorId,
        validCatalogId,
        Role.CASHIER,
      );

      expect(assignment.operatorCanRegisterSale()).toBeTrue();
    });

    it("operatorCanRegisterSale should return false for non-cashier role", () => {
      const assignment = Assignment.create(
        validOperatorId,
        validCatalogId,
        Role.ADMIN,
      );

      expect(assignment.operatorCanRegisterSale()).toBeFalse();
    });

    it("getValue should return raw properties", () => {
      const assignment = Assignment.create(
        validOperatorId,
        validCatalogId,
        validRole,
      );

      const values = assignment.getValue();

      expect(values.operatorId).toEqual(validOperatorId);
      expect(values.catalogId).toEqual(validCatalogId);
      expect(values.role).toEqual(validRole);
    });

    it("equals should return true for identical assignments", () => {
      const a1 = Assignment.create(validOperatorId, validCatalogId, validRole);
      const a2 = Assignment.create(validOperatorId, validCatalogId, validRole);

      expect(a1.equals(a2)).toBeTrue();
    });
  });

  describe("Serialization", () => {
    it("Should create from JSON", () => {
      const json = {
        operatorId: validOperatorId.getValue(),
        catalogId: validCatalogId.getValue(),
        role: "cashier",
      };

      const assignment = Assignment.fromJSON(json);

      expect(assignment).toBeInstanceOf(Assignment);
      expect(assignment.operatorId.equals(validOperatorId)).toBeTrue();
      expect(assignment.role.getValue()).toBe("cashier");
    });
  });
});
