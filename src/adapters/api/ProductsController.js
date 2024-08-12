const { Router } = require("express");

const ProductDTO = require("../../core/products/dto/ProductDTO");

const InvalidCategoryError = require("../../core/products/exceptions/InvalidCategoryError");
const MissingPropertyError = require("../../core/common/exceptions/MissingPropertyError");
const ResourceNotFoundError = require("../../core/common/exceptions/ResourceNotFoundError");

class ProductsController {
  constructor(productManagementUseCase) {
    this.router = new Router();
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
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    });

    this.router.get("/products/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const products = await this.useCase.findById(id);
        return res.status(200).json(products);
      } catch (error) {
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
      } catch (error) {
        if (
          error instanceof MissingPropertyError ||
          error instanceof InvalidCategoryError
        ) {
          return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
      }
    });

    this.router.put("/products/:id", async (req, res) => {
      try {
        const id = req.params.id;
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
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return res.status(404).json({ message: error.message });
        }
        if (
          error instanceof MissingPropertyError ||
          error instanceof InvalidCategoryError
        ) {
          return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
      }
    });

    this.router.delete("/products/:id", async (req, res) => {
      try {
        const id = req.params.id;
        await this.useCase.delete(id);
        return res.status(204).json({});
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    });

    this.router.get("/category/:category/products", async (req, res) => {
      try {
        const category = req.params.category;
        const products = await this.useCase.findByCategory(category);
        return res.status(200).json(products);
      } catch (error) {
        if (error instanceof InvalidCategoryError) {
          return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
      }
    });
  }
}

module.exports = ProductsController;
