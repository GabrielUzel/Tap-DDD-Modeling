import { describe, it, expect } from "bun:test";
import { Email } from "../../../domain/@shared/value-objects/email.value";

describe("Email value object tests", () => {
  describe("Factory (create)", () => {
    it("Should create email successfully", () => {
      const email = Email.create("valid@gmail.com");

      expect(email).toBeInstanceOf(Email);
      expect(email.getValue()).toBe("valid@gmail.com");
    });

    it("Should throw error if email is empty", () => {
      expect(() => Email.create("")).toThrowError("Email cannot be empty");
    });

    it("Should throw error if email format is invalid (no @)", () => {
      expect(() => Email.create("invalid-email")).toThrowError(
        "Email format invalid",
      );
    });
  });

  describe("Methods", () => {
    it("equals should return true for identical emails", () => {
      const email1 = Email.create("test@test.com");
      const email2 = Email.create("test@test.com");

      expect(email1.equals(email2)).toBeTrue();
    });
  });
});
