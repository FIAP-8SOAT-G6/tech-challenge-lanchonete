"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _SequelizeProductRepository_instances, _SequelizeProductRepository_findAllProducts, _SequelizeProductRepository_findImagesByProductId, _SequelizeProductRepository_addImages, _SequelizeProductRepository_deleteImages, _SequelizeProductRepository_createProductDTO;
Object.defineProperty(exports, "__esModule", { value: true });
const ProductDTO_1 = __importDefault(require("../../core/products/dto/ProductDTO"));
const product_1 = __importDefault(require("../../infrastructure/database/models/product"));
const image_1 = __importDefault(require("../../infrastructure/database/models/image"));
class SequelizeProductRepository {
    constructor() {
        _SequelizeProductRepository_instances.add(this);
    }
    create(productDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, category, description, price, images } = productDTO;
            const createdProduct = yield product_1.default.create({
                name,
                category,
                description,
                price
            });
            createdProduct.images = yield __classPrivateFieldGet(this, _SequelizeProductRepository_instances, "m", _SequelizeProductRepository_addImages).call(this, {
                productId: createdProduct.id,
            });
            return __classPrivateFieldGet(this, _SequelizeProductRepository_instances, "m", _SequelizeProductRepository_createProductDTO).call(this, createdProduct);
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield __classPrivateFieldGet(this, _SequelizeProductRepository_instances, "m", _SequelizeProductRepository_findAllProducts).call(this, {});
            return products ? products === null || products === void 0 ? void 0 : products.map(__classPrivateFieldGet(this, _SequelizeProductRepository_instances, "m", _SequelizeProductRepository_createProductDTO)) : [];
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield product_1.default.findByPk(id);
            const images = yield __classPrivateFieldGet(this, _SequelizeProductRepository_instances, "m", _SequelizeProductRepository_findImagesByProductId).call(this, id);
            if (product && (images === null || images === void 0 ? void 0 : images.length) > 0)
                product.images = images;
            return product ? __classPrivateFieldGet(this, _SequelizeProductRepository_instances, "m", _SequelizeProductRepository_createProductDTO).call(this, product) : undefined;
        });
    }
    findByCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield __classPrivateFieldGet(this, _SequelizeProductRepository_instances, "m", _SequelizeProductRepository_findAllProducts).call(this, { where: { category } });
            return products ? products === null || products === void 0 ? void 0 : products.map(__classPrivateFieldGet(this, _SequelizeProductRepository_instances, "m", _SequelizeProductRepository_createProductDTO)) : [];
        });
    }
    update(productDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbProduct = yield product_1.default.findByPk(productDTO.id);
            if (dbProduct) {
                const updatedProduct = yield dbProduct.update({
                    name: productDTO.name,
                    category: productDTO.category,
                    description: productDTO.description,
                    price: productDTO.price
                });
                yield __classPrivateFieldGet(this, _SequelizeProductRepository_instances, "m", _SequelizeProductRepository_deleteImages).call(this, productDTO.id);
                updatedProduct.images = yield __classPrivateFieldGet(this, _SequelizeProductRepository_instances, "m", _SequelizeProductRepository_addImages).call(this, {
                    productId: productDTO.id,
                    images: productDTO === null || productDTO === void 0 ? void 0 : productDTO.images
                });
                return __classPrivateFieldGet(this, _SequelizeProductRepository_instances, "m", _SequelizeProductRepository_createProductDTO).call(this, updatedProduct);
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield product_1.default.findByPk(id);
            if (!product)
                return;
            yield product.destroy();
            yield __classPrivateFieldGet(this, _SequelizeProductRepository_instances, "m", _SequelizeProductRepository_deleteImages).call(this, id);
        });
    }
}
_SequelizeProductRepository_instances = new WeakSet(), _SequelizeProductRepository_findAllProducts = function _SequelizeProductRepository_findAllProducts(conditions) {
    return __awaiter(this, void 0, void 0, function* () {
        const products = yield product_1.default.findAll(conditions);
        return yield Promise.all(products.map((product) => __awaiter(this, void 0, void 0, function* () {
            const images = yield __classPrivateFieldGet(this, _SequelizeProductRepository_instances, "m", _SequelizeProductRepository_findImagesByProductId).call(this, product.id);
            if ((images === null || images === void 0 ? void 0 : images.length) > 0)
                product.images = images;
            return product;
        })));
    });
}, _SequelizeProductRepository_findImagesByProductId = function _SequelizeProductRepository_findImagesByProductId(productId) {
    return __awaiter(this, void 0, void 0, function* () {
        const images = yield image_1.default.findAll({
            where: { ProductId: productId }
        });
        return images;
    });
}, _SequelizeProductRepository_addImages = function _SequelizeProductRepository_addImages(_a) {
    return __awaiter(this, arguments, void 0, function* ({ productId, images }) {
        if (!images)
            return;
        const newImages = yield Promise.all(images.map((image) => image_1.default.create({
            ProductId: productId,
            url: image.url
        })));
        return newImages;
    });
}, _SequelizeProductRepository_deleteImages = function _SequelizeProductRepository_deleteImages(productId) {
    return __awaiter(this, void 0, void 0, function* () {
        const dbImages = yield image_1.default.findAll({
            where: { ProductId: productId }
        });
        if (dbImages.length > 0) {
            for (const image of dbImages) {
                yield image.destroy();
            }
        }
    });
}, _SequelizeProductRepository_createProductDTO = function _SequelizeProductRepository_createProductDTO(values) {
    return new ProductDTO_1.default({
        id: values.id,
        name: values.name,
        category: values.category,
        description: values.description,
        price: values.price,
        images: values.images
    });
};
exports.default = SequelizeProductRepository;
module.exports = SequelizeProductRepository;
