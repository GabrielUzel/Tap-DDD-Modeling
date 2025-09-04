import { describe, it, expect, beforeEach } from "bun:test";
import ServicesFactory from "../../../application/services/services.factory";
import { SaleService } from "../../../application/services/sale.service";
import type { SellerService } from "../../../application/services/seller.service";
import { isRight } from "../../../shared/either.protocol";
import { Uuid } from "../../../shared/uuid";
import type { OperationService } from "../../../application/services/operation.service";
import type { OperatorService } from "../../../application/services/operator.service";
import type { CatalogService } from "../../../application/services/catalog.service";

describe("Sale service tests", () => {
  let saleService: SaleService;
  let operationService: OperationService;
  let sellerService: SellerService;
  let operatorService: OperatorService;
  let catalogService: CatalogService; 

  beforeEach(() => {
    const services = ServicesFactory.create();
    saleService = services.saleService;
    operationService = services.operationService;
    sellerService = services.sellerService;
    operatorService = services.operatorService;
    catalogService = services.catalogService;
  });

  describe("Register sale tests", () => {
    let operation: { right?: { operationId: string } };
    let seller: { right?: { sellerId: string } };
    let catalog: { right?: { catalogId: string } };
    let catalogItem: { right?: { itemId: string } };
    let anotherCatalogItem: { right?: { itemId: string } };
    let operator: { right?: { operatorId: string } };

    beforeEach(async () => {
      operation = await operationService.createOperation({
        name: "Test Operation",
      });

      seller = await sellerService.createSeller({
        name: "Test Seller",
        email: "test@example.com",
      });

      await operationService.addSeller({
        operationId: operation.right!.operationId,
        sellerId: seller.right!.sellerId,
      });

      operator = await operatorService.createOperator({
        name: "Test Operator",
        email: "test@example.com",
      });

      await sellerService.addOperatorToSellerPool({
        sellerId: seller.right!.sellerId,
        operatorId: operator.right!.operatorId,
      });

      await operationService.addOperator({
        operationId: operation.right!.operationId,
        sellerId: seller.right!.sellerId,
        operatorId: operator.right!.operatorId,
      });

      catalog = await operationService.addCatalog({
        operationId: operation.right!.operationId,
        sellerId: seller.right!.sellerId,
        catalog: {
          name: "Test Catalog",
          type: "general",
        },
      });

      catalogItem = await operationService.addCatalogItem({
        operationId: operation.right!.operationId,
        sellerId: seller.right!.sellerId,
        catalogId: catalog.right!.catalogId,
        item: {
          name: "Test Item",
          price: {
            amount: 100,
            sufix: "BRL",
          },
        },
      });

      anotherCatalogItem = await operationService.addCatalogItem({
        operationId: operation.right!.operationId,
        sellerId: seller.right!.sellerId,
        catalogId: catalog.right!.catalogId,
        item: {
          name: "Test Item 2",
          price: {
            amount: 50,
            sufix: "BRL",
          },
        },
      });

      await operationService.addAssignment({
        operationId: operation.right!.operationId,
        sellerId: seller.right!.sellerId,
        assignment: {
          operatorId: operator.right!.operatorId,
          catalogId: catalog.right!.catalogId,
          role: "cashier",
        },
      });
    });

    it("Should register a sale successfully", async () => {
      await operationService.startOperation({
        operationId: operation.right!.operationId,
      });
      
      const input = {
        sellerId: seller.right!.sellerId,
        operationId: operation.right!.operationId,
        operatorId: operator.right!.operatorId,
        catalogId: catalog.right!.catalogId,
        items: [
          {
            itemId: catalogItem.right!.itemId,
            quantity: 2,
          },
          {
            itemId: anotherCatalogItem.right!.itemId,
            quantity: 1,
          },
        ],
      };

      const result = await saleService.registerSale(input);
      expect(isRight(result)).toBe(true);
    });

    it("Should not register a sale, operation has not started", async () => {
      const input = {
        sellerId: seller.right!.sellerId,
        operationId: operation.right!.operationId,
        operatorId: operator.right!.operatorId,
        catalogId: catalog.right!.catalogId,
        items: [
          {
            itemId: catalogItem.right!.itemId,
            quantity: 2,
          },
          {
            itemId: anotherCatalogItem.right!.itemId,
            quantity: 1,
          },
        ],
      };

      const result = await saleService.registerSale(input);
      expect(result.left?.message).toBe("Operation must be on_going to register a sale");
    });

    it("Should not register a sale, seller not part of operation", async () => {
      const anotherSeller = await sellerService.createSeller({
        name: "Another Seller",
        email: "another@example.com",
      });
      
      await operationService.startOperation({
        operationId: operation.right!.operationId,
      });
      
      const input = {
        sellerId: anotherSeller.right!.sellerId,
        operationId: operation.right!.operationId,
        operatorId: operator.right!.operatorId,
        catalogId: catalog.right!.catalogId,
        items: [
          {
            itemId: catalogItem.right!.itemId,
            quantity: 2,
          },
          {
            itemId: anotherCatalogItem.right!.itemId,
            quantity: 1,
          },
        ],
      };

      const result = await saleService.registerSale(input);
      expect(result.left?.message).toBe("Seller does not belong to this operation");
    });

    it("Should not register a sale, catalog does not belong to operation or seller", async () => {
      const anotherCatalog = await catalogService.createCatalog({
        name: "Another Catalog",
        catalogType: "general",
      });

      await operationService.startOperation({
        operationId: operation.right!.operationId,
      });

      const input = {
        sellerId: seller.right!.sellerId,
        operationId: operation.right!.operationId,
        operatorId: operator.right!.operatorId,
        catalogId: anotherCatalog.right!.catalogId,
        items: [
          {
            itemId: catalogItem.right!.itemId,
            quantity: 2,
          },
          {
            itemId: anotherCatalogItem.right!.itemId,
            quantity: 1,
          },
        ],
      };

      const result = await saleService.registerSale(input);
      expect(result.left?.message).toBe("Catalog does not belong to this seller");
    });

    it("Should not register a sale, operator not assigned to operation", async () => {
      const anotherOperator = await operatorService.createOperator({
        name: "Another Operator",
        email: "another@example.com",
      });

      await sellerService.addOperatorToSellerPool({
        sellerId: seller.right!.sellerId,
        operatorId: anotherOperator.right!.operatorId,
      });

      await operationService.startOperation({
        operationId: operation.right!.operationId,
      });

      const input = {
        sellerId: seller.right!.sellerId,
        operationId: operation.right!.operationId,
        operatorId: anotherOperator.right!.operatorId,
        catalogId: catalog.right!.catalogId,
        items: [
          {
            itemId: catalogItem.right!.itemId,
            quantity: 2,
          },
          {
            itemId: anotherCatalogItem.right!.itemId,
            quantity: 1,
          },
        ],
      };

      const result = await saleService.registerSale(input);
      expect(result.left?.message).toBe("Operator is not assigned to this operation");
    });

    it("Should not register a sale, operator not assigned to catalog", async () => {
      const anotherCatalog = await operationService.addCatalog({
        operationId: operation.right!.operationId,
        sellerId: seller.right!.sellerId,
        catalog: {
          name: "Another Catalog",
          type: "general",
        },
      });


      await operationService.startOperation({
        operationId: operation.right!.operationId,
      });

      const input = {
        sellerId: seller.right!.sellerId,
        operationId: operation.right!.operationId,
        operatorId: operator.right!.operatorId,
        catalogId: anotherCatalog.right!.catalogId,
        items: [
          {
            itemId: catalogItem.right!.itemId,
            quantity: 2,
          },
          {
            itemId: anotherCatalogItem.right!.itemId,
            quantity: 1,
          },
        ],
      };

      const result = await saleService.registerSale(input);
      expect(result.left?.message).toBe("Operator is not assigned to this catalog");
    });

    it("Should not register a sale, item does not belong to catalog", async () => {      
      const anotherCatalog = await operationService.addCatalog({
        operationId: operation.right!.operationId,
        sellerId: seller.right!.sellerId,
        catalog: {
          name: "Another Catalog",
          type: "general",
        },
      });

      const anotherCatalogItem = await operationService.addCatalogItem({
        operationId: operation.right!.operationId,
        sellerId: seller.right!.sellerId,
        catalogId: anotherCatalog.right!.catalogId,
        item: {
          name: "Another Item",
          price: {
            amount: 200,
            sufix: "BRL",
          },
        },
      });

      await operationService.startOperation({
        operationId: operation.right!.operationId,
      });

      const input = {
        sellerId: seller.right!.sellerId,
        operationId: operation.right!.operationId,
        operatorId: operator.right!.operatorId,
        catalogId: catalog.right!.catalogId,
        items: [
          {
            itemId: anotherCatalogItem.right!.itemId,
            quantity: 2,
          },
        ],
      };

      const result = await saleService.registerSale(input);
      expect(result.left?.message).toBe("Catalog item does not belong to this catalog");
    });

    it("Should not register a sale, item does not exist", async () => {
      await operationService.startOperation({
        operationId: operation.right!.operationId,
      });

      const input = {
        sellerId: seller.right!.sellerId,
        operationId: operation.right!.operationId,
        operatorId: operator.right!.operatorId,
        catalogId: catalog.right!.catalogId,
        items: [
          {
            itemId: Uuid.generate().getValue(),
            quantity: 2,
          },
        ],
      };

      const result = await saleService.registerSale(input);
      expect(result.left?.message).toBe("Catalog item not found");
    });
  });
});