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
var _FakeProductRepository_instances, _FakeProductRepository_findProductWithImage, _FakeProductRepository_addImages, _FakeProductRepository_deleteImages, _FakeProductRepository_createProductDTO;
Object.defineProperty(exports, "__esModule", { value: true });
const ProductDTO_1 = __importDefault(require("../../core/products/dto/ProductDTO"));
class FakeProductRepository {
    constructor() {
        _FakeProductRepository_instances.add(this);
        this.products = [];
        this.images = [];
    }
    create(productDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, category, description, price, images } = productDTO;
            const createdProduct = {
                id: this.products.length + 1,
                name,
                category,
                description,
                price,
                images: []
            };
            this.products.push(createdProduct);
            __classPrivateFieldGet(this, _FakeProductRepository_instances, "m", _FakeProductRepository_addImages).call(this, { productId: createdProduct.id, images: images });
            createdProduct.images.push(...this.images);
            return __classPrivateFieldGet(this, _FakeProductRepository_instances, "m", _FakeProductRepository_createProductDTO).call(this, createdProduct);
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield __classPrivateFieldGet(this, _FakeProductRepository_instances, "m", _FakeProductRepository_findProductWithImage).call(this, this.products);
            return Promise.resolve(products === null || products === void 0 ? void 0 : products.map(__classPrivateFieldGet(this, _FakeProductRepository_instances, "m", _FakeProductRepository_createProductDTO)));
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = this.products.find((product) => (product === null || product === void 0 ? void 0 : product.id) === id);
            const images = this.images.filter((image) => (image === null || image === void 0 ? void 0 : image.productId) === id);
            if ((images === null || images === void 0 ? void 0 : images.length) > 0)
                product.images = images;
            return Promise.resolve(product ? __classPrivateFieldGet(this, _FakeProductRepository_instances, "m", _FakeProductRepository_createProductDTO).call(this, product) : undefined);
        });
    }
    findByCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            const productsByCategory = this.products.filter((product) => (product === null || product === void 0 ? void 0 : product.category) === category);
            const products = __classPrivateFieldGet(this, _FakeProductRepository_instances, "m", _FakeProductRepository_findProductWithImage).call(this, productsByCategory);
            return Promise.resolve(products === null || products === void 0 ? void 0 : products.map(__classPrivateFieldGet(this, _FakeProductRepository_instances, "m", _FakeProductRepository_createProductDTO)));
        });
    }
    update(productDTO) {
        const productIndex = this.products.findIndex((persistedProduct) => (persistedProduct === null || persistedProduct === void 0 ? void 0 : persistedProduct.id) === productDTO.id);
        this.products[productIndex].name = productDTO.name;
        this.products[productIndex].category = productDTO.category;
        this.products[productIndex].description = productDTO.description;
        this.products[productIndex].price = productDTO.price;
        __classPrivateFieldGet(this, _FakeProductRepository_instances, "m", _FakeProductRepository_deleteImages).call(this, productDTO.id);
        this.products[productIndex].images = __classPrivateFieldGet(this, _FakeProductRepository_instances, "m", _FakeProductRepository_addImages).call(this, {
            productId: productDTO.id,
            images: productDTO === null || productDTO === void 0 ? void 0 : productDTO.images
        });
        return Promise.resolve(__classPrivateFieldGet(this, _FakeProductRepository_instances, "m", _FakeProductRepository_createProductDTO).call(this, this.products[productIndex]));
    }
    delete(id) {
        const productIndex = this.products.findIndex((product) => (product === null || product === void 0 ? void 0 : product.id) === id);
        delete this.products[productIndex];
        return Promise.resolve();
    }
}
_FakeProductRepository_instances = new WeakSet(), _FakeProductRepository_findProductWithImage = function _FakeProductRepository_findProductWithImage(products) {
    return products.map((product) => {
        const images = this.images.filter((image) => (image === null || image === void 0 ? void 0 : image.productId) === product.id);
        if ((images === null || images === void 0 ? void 0 : images.length) > 0)
            product.images = images;
        return product;
    });
}, _FakeProductRepository_addImages = function _FakeProductRepository_addImages({ productId, images }) {
    if (!images || (images === null || images === void 0 ? void 0 : images.length) === 0)
        return [];
    images === null || images === void 0 ? void 0 : images.forEach((image) => {
        var _a;
        image.id = ((_a = this.images) === null || _a === void 0 ? void 0 : _a.length) + 1;
        image.productId = productId;
        this.images.push(image);
    });
    return images;
}, _FakeProductRepository_deleteImages = function _FakeProductRepository_deleteImages(productId) {
    this.images = this.images.filter((image) => (image === null || image === void 0 ? void 0 : image.productId) !== productId);
}, _FakeProductRepository_createProductDTO = function _FakeProductRepository_createProductDTO(databaseProduct) {
    return new ProductDTO_1.default({
        id: databaseProduct.id,
        name: databaseProduct.name,
        category: databaseProduct.category,
        description: databaseProduct.description,
        price: databaseProduct.price,
        images: databaseProduct.images
    });
};
exports.default = FakeProductRepository;
module.exports = FakeProductRepository;
