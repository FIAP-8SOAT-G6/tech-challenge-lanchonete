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
var _OrderManagement_instances, _OrderManagement_isCustomerAnonymous, _OrderManagement_validateCustomerExists, _OrderManagement_generateCode, _OrderManagement_toOrderEntity, _OrderManagement_toOrderDTO, _OrderManagement_toItemDTO;
Object.defineProperty(exports, "__esModule", { value: true });
const Order_1 = __importDefault(require("../entities/Order"));
const OrderStatus_1 = require("../entities/OrderStatus");
const ResourceNotFoundError_1 = __importDefault(require("../../common/exceptions/ResourceNotFoundError"));
const ItemDTO_1 = __importDefault(require("../dto/ItemDTO"));
const OrderDTO_1 = __importDefault(require("../dto/OrderDTO"));
class OrderManagement {
    constructor(orderRepository, productRepository, customerRepository) {
        _OrderManagement_instances.add(this);
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
    }
    create(orderDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            const { customerId } = orderDTO;
            if (!__classPrivateFieldGet(this, _OrderManagement_instances, "m", _OrderManagement_isCustomerAnonymous).call(this, customerId))
                yield __classPrivateFieldGet(this, _OrderManagement_instances, "m", _OrderManagement_validateCustomerExists).call(this, customerId);
            const order = new Order_1.default({
                status: OrderStatus_1.OrderStatus.CREATED,
                code: __classPrivateFieldGet(this, _OrderManagement_instances, "m", _OrderManagement_generateCode).call(this),
                customerId: customerId
            });
            const createdOrderDTO = yield this.orderRepository.create(__classPrivateFieldGet(this, _OrderManagement_instances, "m", _OrderManagement_toOrderDTO).call(this, order));
            const completeOrderDTO = yield this.orderRepository.findById(createdOrderDTO.id);
            const completeOrder = __classPrivateFieldGet(this, _OrderManagement_instances, "m", _OrderManagement_toOrderEntity).call(this, completeOrderDTO);
            return __classPrivateFieldGet(this, _OrderManagement_instances, "m", _OrderManagement_toOrderDTO).call(this, completeOrder);
        });
    }
    getOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            const repositoryOrderDTOs = yield this.orderRepository.findAll();
            const orders = repositoryOrderDTOs.map(__classPrivateFieldGet(this, _OrderManagement_instances, "m", _OrderManagement_toOrderEntity));
            return orders.map(__classPrivateFieldGet(this, _OrderManagement_instances, "m", _OrderManagement_toOrderDTO).bind(this));
        });
    }
    getOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const repositoryOrderDTO = yield this.orderRepository.findById(orderId);
            if (!repositoryOrderDTO)
                throw new ResourceNotFoundError_1.default(ResourceNotFoundError_1.default.Resources.Order, "id", orderId);
            const order = __classPrivateFieldGet(this, _OrderManagement_instances, "m", _OrderManagement_toOrderEntity).call(this, repositoryOrderDTO);
            return __classPrivateFieldGet(this, _OrderManagement_instances, "m", _OrderManagement_toOrderDTO).call(this, order);
        });
    }
    addItem(orderId, itemDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId, quantity } = itemDTO;
            const [productDTO, orderDTO] = yield Promise.all([
                this.productRepository.findById(productId),
                this.orderRepository.findById(orderId)
            ]);
            if (!orderDTO)
                throw new ResourceNotFoundError_1.default(ResourceNotFoundError_1.default.Resources.Order, "id", orderId);
            if (!productDTO)
                throw new ResourceNotFoundError_1.default(ResourceNotFoundError_1.default.Resources.Product, "id", productId);
            const order = __classPrivateFieldGet(this, _OrderManagement_instances, "m", _OrderManagement_toOrderEntity).call(this, orderDTO);
            const item = order.addItem({
                productId: productDTO.id,
                quantity: quantity,
                unitPrice: productDTO.price
            });
            yield this.orderRepository.createItem(__classPrivateFieldGet(this, _OrderManagement_instances, "m", _OrderManagement_toOrderDTO).call(this, order), __classPrivateFieldGet(this, _OrderManagement_instances, "m", _OrderManagement_toItemDTO).call(this, item));
            const updatedOrderDTO = yield this.orderRepository.findById(orderId);
            const updatedOrder = __classPrivateFieldGet(this, _OrderManagement_instances, "m", _OrderManagement_toOrderEntity).call(this, updatedOrderDTO);
            return __classPrivateFieldGet(this, _OrderManagement_instances, "m", _OrderManagement_toOrderDTO).call(this, updatedOrder);
        });
    }
    removeItem(orderId, itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderDTO = yield this.orderRepository.findById(orderId);
            const order = __classPrivateFieldGet(this, _OrderManagement_instances, "m", _OrderManagement_toOrderEntity).call(this, orderDTO);
            order.removeItem(itemId);
            yield this.orderRepository.removeItem(orderId, itemId);
        });
    }
    updateItem(orderId, itemId, itemDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderDTO = yield this.orderRepository.findById(orderId);
            if (!orderDTO)
                throw new ResourceNotFoundError_1.default(ResourceNotFoundError_1.default.Resources.Order, "id", orderId);
            const order = __classPrivateFieldGet(this, _OrderManagement_instances, "m", _OrderManagement_toOrderEntity).call(this, orderDTO);
            const quantity = itemDTO.quantity;
            const updatedItem = order.updateItem(itemId, { quantity });
            yield this.orderRepository.updateItem(itemId, __classPrivateFieldGet(this, _OrderManagement_instances, "m", _OrderManagement_toItemDTO).call(this, updatedItem));
            const updatedOrderDTO = yield this.orderRepository.findById(orderId);
            const updatedOrder = __classPrivateFieldGet(this, _OrderManagement_instances, "m", _OrderManagement_toOrderEntity).call(this, updatedOrderDTO);
            return __classPrivateFieldGet(this, _OrderManagement_instances, "m", _OrderManagement_toOrderDTO).call(this, updatedOrder);
        });
    }
    checkout(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderDTO = yield this.orderRepository.findById(orderId);
            const order = __classPrivateFieldGet(this, _OrderManagement_instances, "m", _OrderManagement_toOrderEntity).call(this, orderDTO);
            order.setStatus(OrderStatus_1.OrderStatus.PENDING_PAYMENT);
            // Fake Checkout: Pagamento não implementado - Mudando para pago
            order.setStatus(OrderStatus_1.OrderStatus.PAYED);
            yield this.orderRepository.updateOrder(__classPrivateFieldGet(this, _OrderManagement_instances, "m", _OrderManagement_toOrderDTO).call(this, order));
        });
    }
}
_OrderManagement_instances = new WeakSet(), _OrderManagement_isCustomerAnonymous = function _OrderManagement_isCustomerAnonymous(customerId) {
    return customerId === null;
}, _OrderManagement_validateCustomerExists = function _OrderManagement_validateCustomerExists(customerId) {
    return __awaiter(this, void 0, void 0, function* () {
        const customerDTO = yield this.customerRepository.findById(customerId);
        if (!customerDTO)
            throw new ResourceNotFoundError_1.default(ResourceNotFoundError_1.default.Resources.Customer, "id", customerId);
    });
}, _OrderManagement_generateCode = function _OrderManagement_generateCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}, _OrderManagement_toOrderEntity = function _OrderManagement_toOrderEntity(orderDTO) {
    return new Order_1.default({
        id: orderDTO.id,
        createdAt: orderDTO.createdAt,
        code: orderDTO.code,
        customerId: orderDTO.customerId,
        status: orderDTO.status,
        totalPrice: orderDTO.totalPrice,
        items: orderDTO.items
    });
}, _OrderManagement_toOrderDTO = function _OrderManagement_toOrderDTO(orderEntity) {
    return new OrderDTO_1.default({
        id: orderEntity.getId(),
        elapsedTime: orderEntity.getElapsedTime(),
        code: orderEntity.getCode(),
        status: orderEntity.getStatus(),
        totalPrice: orderEntity.getTotalPrice(),
        items: orderEntity.getItems().map(__classPrivateFieldGet(this, _OrderManagement_instances, "m", _OrderManagement_toItemDTO)),
        customerId: orderEntity.getCustomerId()
    });
}, _OrderManagement_toItemDTO = function _OrderManagement_toItemDTO(itemEntity) {
    return new ItemDTO_1.default({
        id: itemEntity.getId(),
        orderId: itemEntity.getOrderId(),
        productId: itemEntity.getProductId(),
        productName: itemEntity.getProductName(),
        productDescription: itemEntity.getProductDescription(),
        quantity: itemEntity.getQuantity(),
        unitPrice: itemEntity.getUnitPrice(),
        totalPrice: itemEntity.getTotalPrice()
    });
};
exports.default = OrderManagement;
module.exports = OrderManagement;
