import { Router } from "express";

import ProductDTO from "../../core/products/dto/ProductDTO";

import InvalidCategoryError from "../../core/products/exceptions/InvalidCategoryError";
import MissingPropertyError from "../../core/common/exceptions/MissingPropertyError";
import ResourceNotFoundError from "../../core/common/exceptions/ResourceNotFoundError";
import ProductManagementPort from "../../core/ports/ProductManagement";

export default class ProductsController {
  private router: Router;
  private useCase: ProductManagementPort;

  constructor(productManagementUseCase: ProductManagementPort) {
    this.router = Router();
    this.useCase = productManagementUseCase;

    this.initializeRoutes();
  }

  getRouter() {
    return this.router;
  }

  initializeRoutes() {
    this.router.get("/products", async (req, res) => {
      try {
        const products = await this.useCase.findAll();
        return res.status(200).json(products);
      } catch (error: any) {
        return res.status(500).json({ message: error.message });
      }
    });

    this.router.get("/products/:id", async (req, res) => {
      try {
        const id = Number(req.params.id);
        const products = await this.useCase.findById(id);
        return res.status(200).json(products);
      } catch (error: any) {
        if (error instanceof ResourceNotFoundError) {
          return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
      }
    });

    this.router.post("/products", async (req, res) => {
      try {
        const { name, description, category, price, images } = req.body;
        const productDTO = new ProductDTO({
          name,
          description,
          category,
          price,
          images
        });
        const product = await this.useCase.create(productDTO);
        return res.status(201).json(product);
      } catch (error: any) {
        if (error instanceof MissingPropertyError || error instanceof InvalidCategoryError) {
          return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
      }
    });

    this.router.put("/products/:id", async (req, res) => {
      try {
        const id = Number(req.params.id);
        const { name, description, category, price, images } = req.body;
        const productDTO = new ProductDTO({
          id,
          name,
          category,
          description,
          price,
          images
        });
        const product = await this.useCase.update(productDTO);
        return res.status(201).json(product);
      } catch (error: any) {
        if (error instanceof ResourceNotFoundError) {
          return res.status(404).json({ message: error.message });
        }
        if (error instanceof MissingPropertyError || error instanceof InvalidCategoryError) {
          return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
      }
    });

    this.router.delete("/products/:id", async (req, res) => {
      try {
        const id = Number(req.params.id);
        await this.useCase.delete(id);
        return res.status(204).json({});
      } catch (error: any) {
        return res.status(500).json({ message: error.message });
      }
    });

    this.router.get("/category/:category/products", async (req, res) => {
      try {
        const category = req.params.category;
        const products = await this.useCase.findByCategory(category);
        return res.status(200).json(products);
      } catch (error: any) {
        if (error instanceof InvalidCategoryError) {
          return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
      }
    });
  }
}
