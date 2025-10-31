import { describe, it, expect, beforeEach } from "bun:test";
import { Uuid } from "../../../utils/uuid";
import ServicesFactory from "../../../application/services/services.factory";
import { OperationService } from "../../../application/services/operation.service";
import { OperatorService } from "../../../application/services/operator.service";
import { SellerService } from "../../../application/services/seller.service";
import { isLeft, isRight } from "../../../utils/either.protocol";

describe("Operation service tests", () => {
  let operationService: OperationService;
  let operatorService: OperatorService;
  let sellerService: SellerService;

  beforeEach(() => {
    const services = ServicesFactory.create();
    operationService = services.operationService;
    operatorService = services.operatorService;
    sellerService = services.sellerService;
  });

  describe("Create operation tests", () => {
    it("Should create operation sucessfully", async () => {
      const input = {
        name: "Test Operation",
      };

      const result = await operationService.createOperation(input);
      expect(isRight(result)).toBe(true);
    });

    it("Should not create operation with empty name", async () => {
      const input = {
        name: "",
      };

      const result = await operationService.createOperation(input);
      expect(isLeft(result)).toBe(true);
    });
  });

  describe("Add seller tests", () => {
    it("Should add a seller to an operation", async () => {
      const operation = await operationService.createOperation({
        name: "Test Operation",
      });

      if (!operation.right) {
        throw new Error("Operation creation failed");
      }

      const input = {
        operationId: operation.right.operationId,
        sellerId: Uuid.generate().getValue(),
      };

      const result = await operationService.addSeller({
        operationId: input.operationId,
        sellerId: input.sellerId,
      });

      expect(isRight(result)).toBe(true);
    });

    it("Should return left, operation not found", async () => {
      const input = {
        operationId: Uuid.generate().getValue(),
        sellerId: Uuid.generate().getValue(),
      };

      const result = await operationService.addSeller({
        operationId: input.operationId,
        sellerId: input.sellerId,
      });

      expect(isLeft(result)).toBe(true);
    });
  });

  describe("Add operator tests", () => {
    it("Should add operator to seller pool in operation pool", async () => {
      const operation = await operationService.createOperation({
        name: "Test Operation",
      });

      if (!operation.right) {
        throw new Error("Operation creation failed");
      }

      const operator = await operatorService.createOperator({
        name: "Test Operator",
        email: "test.operator@example.com",
      });

      if (!operator.right) {
        throw new Error("Operator creation failed");
      }

      const sellerId = Uuid.generate().getValue();

      await operationService.addSeller({
        operationId: operation.right.operationId,
        sellerId,
      });

      const result = await operationService.addOperator({
        operationId: operation.right.operationId,
        sellerId,
        operatorId: operator.right.operatorId,
      });

      expect(isRight(result)).toBe(true);
    });

    it("Should return left, operation not found", async () => {
      const input = {
        operationId: Uuid.generate().getValue(),
        sellerId: Uuid.generate().getValue(),
        operatorId: Uuid.generate().getValue(),
      };

      const result = await operationService.addOperator({
        operationId: input.operationId,
        sellerId: input.sellerId,
        operatorId: input.operatorId,
      });

      expect(result.left?.message).toBe("Operation not found");
    });

    it("Should return left, operator not found", async () => {
      const operation = await operationService.createOperation({
        name: "Test Operation",
      });

      if (!operation.right) {
        throw new Error("Operation creation failed");
      }

      const sellerId = Uuid.generate().getValue();

      await operationService.addSeller({
        operationId: operation.right.operationId,
        sellerId,
      });

      const input = {
        operationId: operation.right.operationId,
        sellerId,
        operatorId: Uuid.generate().getValue(),
      };

      const result = await operationService.addOperator({
        operationId: input.operationId,
        sellerId: input.sellerId,
        operatorId: input.operatorId,
      });

      expect(result.left?.message).toBe("Operator not found");
    });
  });

  describe("Add catalog tests", () => {
    it("Should add catalog to seller in operation", async () => {
      const operation = await operationService.createOperation({
        name: "Test Operation",
      });

      if (!operation.right) {
        throw new Error("Operation creation failed");
      }

      const sellerId = Uuid.generate().getValue();

      await operationService.addSeller({
        operationId: operation.right.operationId,
        sellerId,
      });

      const input = {
        operationId: operation.right.operationId,
        sellerId,
        catalog: {
          name: "Test Catalog",
          type: "general",
        },
      };

      const result = await operationService.addCatalog(input);

      expect(isRight(result)).toBe(true);
    });

    it("Should return left, operation not found", async () => {
      const input = {
        operationId: Uuid.generate().getValue(),
        sellerId: Uuid.generate().getValue(),
        catalog: {
          name: "Test Catalog",
          type: "general",
        },
      };

      const result = await operationService.addCatalog(input);

      expect(result.left?.message).toBe("Operation not found");
    });

    it("Should return left, invalid catalog type", async () => {
      const operation = await operationService.createOperation({
        name: "Test Operation",
      });

      if (!operation.right) {
        throw new Error("Operation creation failed");
      }

      const sellerId = Uuid.generate().getValue();

      await operationService.addSeller({
        operationId: operation.right.operationId,
        sellerId,
      });

      const input = {
        operationId: operation.right.operationId,
        sellerId,
        catalog: {
          name: "Test Catalog",
          type: "invalid_type",
        },
      };

      const result = await operationService.addCatalog(input);

      expect(result.left?.message).toBe("Invalid catalog type");
    });

    it("Should return left, name is empty", async () => {
      const operation = await operationService.createOperation({
        name: "Test Operation",
      });

      if (!operation.right) {
        throw new Error("Operation creation failed");
      }

      const sellerId = Uuid.generate().getValue();

      await operationService.addSeller({
        operationId: operation.right.operationId,
        sellerId,
      });

      const input = {
        operationId: operation.right.operationId,
        sellerId,
        catalog: {
          name: "",
          type: "general",
        },
      };

      const result = await operationService.addCatalog(input);

      expect(result.left?.message).toBe("Name cannot be empty");
    });
  });

  describe("Add catalog item tests", () => {
    it("Should add item to catalog of seller in operation", async () => {
      const operation = await operationService.createOperation({
        name: "Test Operation",
      });

      if (!operation.right) {
        throw new Error("Operation creation failed");
      }

      const sellerId = Uuid.generate().getValue();

      await operationService.addSeller({
        operationId: operation.right.operationId,
        sellerId,
      });

      const catalogResult = await operationService.addCatalog({
        operationId: operation.right.operationId,
        sellerId,
        catalog: {
          name: "Test Catalog",
          type: "general",
        },
      });

      if (isLeft(catalogResult)) {
        throw new Error("Catalog creation failed");
      }

      const input = {
        operationId: operation.right.operationId,
        sellerId,
        catalogId: catalogResult.right.catalogId,
        item: {
          name: "Test Item",
          price: {
            amount: 100,
            sufix: "BRL",
          },
        },
      };

      const result = await operationService.addCatalogItem(input);

      expect(isRight(result)).toBe(true);
    });

    it("Should return left, operation not found", async () => {
      const input = {
        operationId: Uuid.generate().getValue(),
        sellerId: Uuid.generate().getValue(),
        catalogId: Uuid.generate().getValue(),
        item: {
          name: "Test Item",
          price: {
            amount: 100,
            sufix: "BRL",
          },
        },
      };

      const result = await operationService.addCatalogItem(input);

      expect(result.left?.message).toBe("Operation not found");
    });

    it("Should return left, name is empty", async () => {
      const operation = await operationService.createOperation({
        name: "Test Operation",
      });

      if (!operation.right) {
        throw new Error("Operation creation failed");
      }

      const sellerId = Uuid.generate().getValue();

      await operationService.addSeller({
        operationId: operation.right.operationId,
        sellerId,
      });

      const catalogResult = await operationService.addCatalog({
        operationId: operation.right.operationId,
        sellerId,
        catalog: {
          name: "Test Catalog",
          type: "general",
        },
      });

      if (isLeft(catalogResult)) {
        throw new Error("Catalog creation failed");
      }

      const input = {
        operationId: operation.right.operationId,
        sellerId,
        catalogId: catalogResult.right.catalogId,
        item: {
          name: "",
          price: {
            amount: 100,
            sufix: "BRL",
          },
        },
      };

      const result = await operationService.addCatalogItem(input);

      expect(result.left?.message).toBe("Name cannot be empty");
    });

    it("Should return left, invalid money sufix", async () => {
      const operation = await operationService.createOperation({
        name: "Test Operation",
      });

      if (!operation.right) {
        throw new Error("Operation creation failed");
      }

      const sellerId = Uuid.generate().getValue();

      await operationService.addSeller({
        operationId: operation.right.operationId,
        sellerId,
      });

      const catalogResult = await operationService.addCatalog({
        operationId: operation.right.operationId,
        sellerId,
        catalog: {
          name: "Test Catalog",
          type: "general",
        },
      });

      if (isLeft(catalogResult)) {
        throw new Error("Catalog creation failed");
      }

      const input = {
        operationId: operation.right.operationId,
        sellerId,
        catalogId: catalogResult.right.catalogId,
        item: {
          name: "Test Item",
          price: {
            amount: 100,
            sufix: "invalid_sufix",
          },
        },
      };

      const result = await operationService.addCatalogItem(input);

      expect(result.left?.message).toBe("Invalid money suffix");
    });

    it("Should return left, value is negative", async () => {
      const operation = await operationService.createOperation({
        name: "Test Operation",
      });

      if (!operation.right) {
        throw new Error("Operation creation failed");
      }

      const sellerId = Uuid.generate().getValue();

      await operationService.addSeller({
        operationId: operation.right.operationId,
        sellerId,
      });

      const catalogResult = await operationService.addCatalog({
        operationId: operation.right.operationId,
        sellerId,
        catalog: {
          name: "Test Catalog",
          type: "general",
        },
      });

      if (isLeft(catalogResult)) {
        throw new Error("Catalog creation failed");
      }

      const input = {
        operationId: operation.right.operationId,
        sellerId,
        catalogId: catalogResult.right.catalogId,
        item: {
          name: "Test Item",
          price: {
            amount: -100,
            sufix: "BRL",
          },
        },
      };

      const result = await operationService.addCatalogItem(input);

      expect(result.left?.message).toBe("Value must be greater than zero");
    });

    it("Should return left, catalog not found", async () => {
      const operation = await operationService.createOperation({
        name: "Test Operation",
      });

      if (!operation.right) {
        throw new Error("Operation creation failed");
      }

      const sellerId = Uuid.generate().getValue();

      await operationService.addSeller({
        operationId: operation.right.operationId,
        sellerId,
      });

      const input = {
        operationId: operation.right.operationId,
        sellerId,
        catalogId: Uuid.generate().getValue(),
        item: {
          name: "Test Item",
          price: {
            amount: 100,
            sufix: "BRL",
          },
        },
      };

      const result = await operationService.addCatalogItem(input);

      expect(result.left?.message).toBe("Catalog not found");
    });
  });

  describe("Add assignment tests", () => {
    it("Should add assignment to operation", async () => {
      const operationResult = await operationService.createOperation({
        name: "Test Operation",
      });

      if (!operationResult.right) {
        throw new Error("Operation creation failed");
      }

      const sellerResult = await sellerService.createSeller({
        name: "Test Seller",
        email: "test@example.com",
      });

      if (!sellerResult.right) {
        throw new Error("Seller creation failed");
      }

      const operatorResult = await operatorService.createOperator({
        name: "Test Operator",
        email: "test@example.com",
      });

      if (!operatorResult.right) {
        throw new Error("Operator creation failed");
      }

      await operationService.addSeller({
        operationId: operationResult.right.operationId,
        sellerId: sellerResult.right.sellerId,
      });

      await sellerService.addOperatorToSellerPool({
        sellerId: sellerResult.right.sellerId,
        operatorId: operatorResult.right.operatorId,
      });

      await operationService.addOperator({
        operationId: operationResult.right.operationId,
        sellerId: sellerResult.right.sellerId,
        operatorId: operatorResult.right.operatorId,
      });

      const catalogResult = await operationService.addCatalog({
        operationId: operationResult.right.operationId,
        sellerId: sellerResult.right.sellerId,
        catalog: {
          name: "Test Catalog",
          type: "general",
        },
      });

      if (isLeft(catalogResult)) {
        throw new Error("Catalog creation failed");
      }

      const input = {
        operationId: operationResult.right.operationId,
        sellerId: sellerResult.right.sellerId,
        assignment: {
          operatorId: operatorResult.right.operatorId,
          catalogId: catalogResult.right.catalogId,
          role: "admin",
        },
      };

      const result = await operationService.addAssignment(input);

      expect(isRight(result)).toBe(true);
    });

    it("Should return left, operator is not in the pool", async () => {
      const input = {
        operationId: Uuid.generate().getValue(),
        sellerId: Uuid.generate().getValue(),
        assignment: {
          operatorId: Uuid.generate().getValue(),
          catalogId: Uuid.generate().getValue(),
          role: "admin",
        },
      };

      const result = await operationService.addAssignment(input);

      expect(result.left?.message).toBe("Operation not found");
    });

    it("Should return left, seller not found", async () => {
      const operationResult = await operationService.createOperation({
        name: "Test Operation",
      });

      if (!operationResult.right) {
        throw new Error("Operation creation failed");
      }

      const input = {
        operationId: operationResult.right.operationId,
        sellerId: Uuid.generate().getValue(),
        assignment: {
          operatorId: Uuid.generate().getValue(),
          catalogId: Uuid.generate().getValue(),
          role: "admin",
        },
      };

      const result = await operationService.addAssignment(input);

      expect(result.left?.message).toBe("Seller not found");
    });

    it("Should return left, operator not found", async () => {
      const operationResult = await operationService.createOperation({
        name: "Test Operation",
      });

      if (!operationResult.right) {
        throw new Error("Operation creation failed");
      }

      const sellerResult = await sellerService.createSeller({
        name: "Test Seller",
        email: "test@example.com",
      });

      if (!sellerResult.right) {
        throw new Error("Seller creation failed");
      }

      const operatorResult = await operatorService.createOperator({
        name: "Test Operator",
        email: "test@example.com",
      });

      if (!operatorResult.right) {
        throw new Error("Operator creation failed");
      }

      await sellerService.addOperatorToSellerPool({
        sellerId: sellerResult.right.sellerId,
        operatorId: operatorResult.right.operatorId,
      });

      await operationService.addSeller({
        operationId: operationResult.right.operationId,
        sellerId: sellerResult.right.sellerId,
      });

      const input = {
        operationId: operationResult.right.operationId,
        sellerId: sellerResult.right.sellerId,
        assignment: {
          operatorId: Uuid.generate().getValue(),
          catalogId: Uuid.generate().getValue(),
          role: "admin",
        },
      };

      const result = await operationService.addAssignment(input);

      expect(result.left?.message).toBe("Operator is not in the pool");
    });

    it("Should return left, catalog does not belong to this operation", async () => {
      const operationResult = await operationService.createOperation({
        name: "Test Operation",
      });

      if (!operationResult.right) {
        throw new Error("Operation creation failed");
      }

      const sellerResult = await sellerService.createSeller({
        name: "Test Seller",
        email: "test@example.com",
      });

      if (!sellerResult.right) {
        throw new Error("Seller creation failed");
      }

      const operatorResult = await operatorService.createOperator({
        name: "Test Operator",
        email: "test@example.com",
      });

      if (!operatorResult.right) {
        throw new Error("Operator creation failed");
      }

      await operationService.addSeller({
        operationId: operationResult.right.operationId,
        sellerId: sellerResult.right.sellerId,
      });

      await sellerService.addOperatorToSellerPool({
        sellerId: sellerResult.right.sellerId,
        operatorId: operatorResult.right.operatorId,
      });

      await operationService.addOperator({
        operationId: operationResult.right.operationId,
        sellerId: sellerResult.right.sellerId,
        operatorId: operatorResult.right.operatorId,
      });

      const input = {
        operationId: operationResult.right.operationId,
        sellerId: sellerResult.right.sellerId,
        assignment: {
          operatorId: operatorResult.right.operatorId,
          catalogId: Uuid.generate().getValue(),
          role: "admin",
        },
      };

      const result = await operationService.addAssignment(input);

      expect(result.left?.message).toBe(
        "Catalog does not belong to this operation",
      );
    });

    it("Should return left, role is invalid", async () => {
      const operationResult = await operationService.createOperation({
        name: "Test Operation",
      });

      if (!operationResult.right) {
        throw new Error("Operation creation failed");
      }

      const sellerResult = await sellerService.createSeller({
        name: "Test Seller",
        email: "test@example.com",
      });

      if (!sellerResult.right) {
        throw new Error("Seller creation failed");
      }

      const operatorResult = await operatorService.createOperator({
        name: "Test Operator",
        email: "test@example.com",
      });

      if (!operatorResult.right) {
        throw new Error("Operator creation failed");
      }

      await operationService.addSeller({
        operationId: operationResult.right.operationId,
        sellerId: sellerResult.right.sellerId,
      });

      await sellerService.addOperatorToSellerPool({
        sellerId: sellerResult.right.sellerId,
        operatorId: operatorResult.right.operatorId,
      });

      await operationService.addOperator({
        operationId: operationResult.right.operationId,
        sellerId: sellerResult.right.sellerId,
        operatorId: operatorResult.right.operatorId,
      });

      const catalogResult = await operationService.addCatalog({
        operationId: operationResult.right.operationId,
        sellerId: sellerResult.right.sellerId,
        catalog: {
          name: "Test Catalog",
          type: "general",
        },
      });

      if (isLeft(catalogResult)) {
        throw new Error("Catalog creation failed");
      }

      const input = {
        operationId: operationResult.right.operationId,
        sellerId: sellerResult.right.sellerId,
        assignment: {
          operatorId: operatorResult.right.operatorId,
          catalogId: catalogResult.right.catalogId,
          role: "invalid_role",
        },
      };

      const result = await operationService.addAssignment(input);

      expect(result.left?.message).toBe("Invalid role type");
    });
  });

  describe("Start operation tests", () => {
    it("Should start operation", async () => {
      const operationResult = await operationService.createOperation({
        name: "Test Operation",
      });

      if (!operationResult.right) {
        throw new Error("Operation creation failed");
      }

      const sellerResult = await sellerService.createSeller({
        name: "Test Seller",
        email: "test@example.com",
      });

      if (!sellerResult.right) {
        throw new Error("Seller creation failed");
      }

      await operationService.addSeller({
        operationId: operationResult.right.operationId,
        sellerId: sellerResult.right.sellerId,
      });

      const catalogResult = await operationService.addCatalog({
        operationId: operationResult.right.operationId,
        sellerId: sellerResult.right.sellerId,
        catalog: {
          name: "Test Catalog",
          type: "general",
        },
      });

      if (isLeft(catalogResult)) {
        throw new Error("Catalog creation failed");
      }

      await operationService.addCatalogItem({
        operationId: operationResult.right.operationId,
        sellerId: sellerResult.right.sellerId,
        catalogId: catalogResult.right.catalogId,
        item: {
          name: "Test Item",
          price: {
            amount: 100,
            sufix: "BRL",
          },
        },
      });

      const input = {
        operationId: operationResult.right.operationId,
      };

      const result = await operationService.startOperation(input);

      expect(result.right).toBeUndefined();
    });

    it("Should return left, operation not found", async () => {
      const input = {
        operationId: Uuid.generate().getValue(),
      };

      const result = await operationService.startOperation(input);
      expect(isLeft(result)).toBe(true);
    });

    it("Should return left, no catalogs registered", async () => {
      const operationResult = await operationService.createOperation({
        name: "Test Operation",
      });

      if (!operationResult.right) {
        throw new Error("Operation creation failed");
      }

      const sellerResult = await sellerService.createSeller({
        name: "Test Seller",
        email: "test@example.com",
      });

      if (!sellerResult.right) {
        throw new Error("Seller creation failed");
      }

      await operationService.addSeller({
        operationId: operationResult.right.operationId,
        sellerId: sellerResult.right.sellerId,
      });

      const input = {
        operationId: operationResult.right.operationId,
      };

      const result = await operationService.startOperation(input);
      expect(result.left?.message).toBe("No catalogs registered");
    });

    it("Should return left, at least one catalog must contain items to start the operation", async () => {
      const operationResult = await operationService.createOperation({
        name: "Test Operation",
      });

      if (!operationResult.right) {
        throw new Error("Operation creation failed");
      }

      const sellerResult = await sellerService.createSeller({
        name: "Test Seller",
        email: "test@example.com",
      });

      if (!sellerResult.right) {
        throw new Error("Seller creation failed");
      }

      await operationService.addSeller({
        operationId: operationResult.right.operationId,
        sellerId: sellerResult.right.sellerId,
      });

      const catalogResult = await operationService.addCatalog({
        operationId: operationResult.right.operationId,
        sellerId: sellerResult.right.sellerId,
        catalog: {
          name: "Test Catalog",
          type: "general",
        },
      });

      if (isLeft(catalogResult)) {
        throw new Error("Catalog creation failed");
      }

      const input = {
        operationId: operationResult.right.operationId,
      };

      const result = await operationService.startOperation(input);
      expect(result.left?.message).toBe(
        "At least one catalog must contain items to start the operation",
      );
    });
  });
});
