import { Router } from "express";
import ProductController from "../controllers/ProductController";
import SequelizeProductDataSource from "../external/SequelizeProductDataSource";
import ResourceNotFoundError from "../core/common/exceptions/ResourceNotFoundError";
import ProductDTO from "../core/products/dto/ProductDTO";
import MissingPropertyError from "../core/common/exceptions/MissingPropertyError";
import InvalidCategoryError from "../core/products/exceptions/InvalidCategoryError";

const productsAPIRouter = Router();

productsAPIRouter.get("/products", async (req, res) => {
  try {
    const products = await ProductController.getAllProducts(new SequelizeProductDataSource());
    return res.status(200).json(products);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

productsAPIRouter.get("/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const products = await ProductController.getByProductId(new SequelizeProductDataSource(), id);
    return res.status(200).json(products);
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
});

productsAPIRouter.post("/products", async (req, res) => {
  try {
    const { name, description, category, price, images } = req.body;
    const productDTO = new ProductDTO({
      name,
      description,
      category,
      price,
      images
    });
    const product = await ProductController.create(new SequelizeProductDataSource(), productDTO);
    return res.status(201).json(product);
  } catch (error: any) {
    if (error instanceof MissingPropertyError || error instanceof InvalidCategoryError) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
});

productsAPIRouter.put("/products/:id", async (req, res) => {
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
    const product = await ProductController.update(new SequelizeProductDataSource(), productDTO);
    return res.status(201).json(product);
  } catch (error: any) {
    if (error instanceof MissingPropertyError || error instanceof InvalidCategoryError) {
      return res.status(400).json({ error: error.message });
    }
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
});

productsAPIRouter.delete("/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await ProductController.delete(new SequelizeProductDataSource(), id);
    return res.status(204).json({});
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

productsAPIRouter.get("/category/:category/products", async (req, res) => {
  try {
    const category = req.params.category;
    const products = await ProductController.getByCategory(new SequelizeProductDataSource(), category);
    return res.status(200).json(products);
  } catch (error: any) {
    if (error instanceof InvalidCategoryError) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
});

export default productsAPIRouter;
