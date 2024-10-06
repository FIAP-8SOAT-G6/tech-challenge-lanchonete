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
var _ProductManagement_instances, _ProductManagement_toProductDTO, _ProductManagement_toProductEntity;
Object.defineProperty(exports, "__esModule", { value: true });
const Product_1 = __importDefault(require("../entities/Product"));
const ProductDTO_1 = __importDefault(require("../dto/ProductDTO"));
const ProductCategory_1 = __importDefault(require("../entities/ProductCategory"));
const InvalidCategoryError_1 = __importDefault(require("../exceptions/InvalidCategoryError"));
const ResourceNotFoundError_1 = __importDefault(require("../../common/exceptions/ResourceNotFoundError"));
class ProductManagement {
    constructor(productRepository) {
        _ProductManagement_instances.add(this);
        this.productRepository = productRepository;
    }
    create(productDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = __classPrivateFieldGet(this, _ProductManagement_instances, "m", _ProductManagement_toProductEntity).call(this, productDTO);
            return yield this.productRepository.create(__classPrivateFieldGet(this, _ProductManagement_instances, "m", _ProductManagement_toProductDTO).call(this, product));
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield this.productRepository.findAll();
            return products;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.productRepository.findById(id);
            if (!product)
                throw new ResourceNotFoundError_1.default(ResourceNotFoundError_1.default.Resources.Product, "id", id);
            return product;
        });
    }
    findByCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Object.keys(ProductCategory_1.default).includes(category))
                throw new InvalidCategoryError_1.default(category);
            const productDTOs = yield this.productRepository.findByCategory(category);
            return productDTOs;
        });
    }
    update(productDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = productDTO;
            const currentProductDTO = yield this.productRepository.findById(id);
            if (!currentProductDTO)
                throw new ResourceNotFoundError_1.default(ResourceNotFoundError_1.default.Resources.Product, "id", id);
            const product = __classPrivateFieldGet(this, _ProductManagement_instances, "m", _ProductManagement_toProductEntity).call(this, currentProductDTO);
            product.setName(productDTO.name);
            product.setCategory(productDTO.category);
            product.setDescription(productDTO.description);
            product.setPrice(productDTO.price);
            product.setImages(productDTO.images);
            const updatedProductDTO = __classPrivateFieldGet(this, _ProductManagement_instances, "m", _ProductManagement_toProductDTO).call(this, product);
            return (yield this.productRepository.update(updatedProductDTO));
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.productRepository.delete(id);
        });
    }
}
_ProductManagement_instances = new WeakSet(), _ProductManagement_toProductDTO = function _ProductManagement_toProductDTO(productEntity) {
    return new ProductDTO_1.default({
        id: productEntity.getId(),
        name: productEntity.getName(),
        category: productEntity.getCategory(),
        description: productEntity.getDescription(),
        price: productEntity.getPrice(),
        images: productEntity.getImages()
    });
}, _ProductManagement_toProductEntity = function _ProductManagement_toProductEntity(productDTO) {
    return new Product_1.default({
        id: productDTO.id,
        name: productDTO.name,
        category: productDTO.category,
        description: productDTO.description,
        price: productDTO.price,
        images: productDTO.images
    });
};
exports.default = ProductManagement;
