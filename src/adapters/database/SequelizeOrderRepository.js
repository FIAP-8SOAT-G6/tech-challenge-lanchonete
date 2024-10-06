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
var _SequelizeOrderRepository_instances, _SequelizeOrderRepository_createOrderDTO;
Object.defineProperty(exports, "__esModule", { value: true });
const ItemDTO_1 = __importDefault(require("../../core/orders/dto/ItemDTO"));
const OrderDTO_1 = __importDefault(require("../../core/orders/dto/OrderDTO"));
const models_1 = require("../../infrastructure/database/models");
const { Order: SequelizeOrder, Item: SequelizeItem, Product: SequelizeProduct, Customer: SequelizeCustomer } = models_1.sequelize.models;
class SequelizeOrderRepository {
    constructor() {
        _SequelizeOrderRepository_instances.add(this);
    }
    create(orderDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status, code, customerId } = orderDTO;
            const createdOrder = yield SequelizeOrder.create({
                status,
                code,
                CustomerId: customerId
            });
            return __classPrivateFieldGet(this, _SequelizeOrderRepository_instances, "m", _SequelizeOrderRepository_createOrderDTO).call(this, createdOrder);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield SequelizeOrder.findByPk(id, {
                include: [
                    {
                        model: SequelizeItem,
                        include: [SequelizeProduct]
                    },
                    {
                        model: SequelizeCustomer
                    }
                ]
            });
            return order ? __classPrivateFieldGet(this, _SequelizeOrderRepository_instances, "m", _SequelizeOrderRepository_createOrderDTO).call(this, order) : undefined;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield SequelizeOrder.findAll({
                include: [
                    {
                        model: SequelizeItem,
                        include: [SequelizeProduct]
                    },
                    {
                        model: SequelizeCustomer
                    }
                ],
                order: [["createdAt", "DESC"]]
            });
            return (orders === null || orders === void 0 ? void 0 : orders.length) === 0 ? undefined : orders.map(__classPrivateFieldGet(this, _SequelizeOrderRepository_instances, "m", _SequelizeOrderRepository_createOrderDTO));
        });
    }
    createItem(order, itemDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderModel = yield SequelizeOrder.findByPk(order.id);
            const { id, orderId: OrderId, productId: ProductId, quantity, unitPrice, totalPrice } = itemDTO;
            yield orderModel.createItem({
                id,
                OrderId,
                ProductId,
                quantity,
                unitPrice,
                totalPrice
            });
        });
    }
    removeItem(orderId, itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield SequelizeOrder.findByPk(orderId);
            yield order.removeItem(itemId);
        });
    }
    updateItem(itemId, itemDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield SequelizeItem.findByPk(itemId);
            yield item.update(itemDTO);
        });
    }
    updateOrder(orderDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, code, status } = orderDTO;
            const order = yield SequelizeOrder.findByPk(id);
            const updatedOrder = order.update({ code, status });
            return __classPrivateFieldGet(this, _SequelizeOrderRepository_instances, "m", _SequelizeOrderRepository_createOrderDTO).call(this, updatedOrder);
        });
    }
}
_SequelizeOrderRepository_instances = new WeakSet(), _SequelizeOrderRepository_createOrderDTO = function _SequelizeOrderRepository_createOrderDTO(databaseOrder) {
    var _a, _b;
    return new OrderDTO_1.default({
        id: databaseOrder.id,
        createdAt: databaseOrder.createdAt,
        code: databaseOrder.code,
        status: databaseOrder.status,
        totalPrice: databaseOrder.totalPrice,
        customerId: databaseOrder.CustomerId,
        customerName: (_a = databaseOrder.Customer) === null || _a === void 0 ? void 0 : _a.name,
        items: (_b = databaseOrder.Items) === null || _b === void 0 ? void 0 : _b.map((databaseItem) => {
            var _a, _b;
            return new ItemDTO_1.default({
                id: databaseItem.id,
                orderId: databaseItem.OrderId,
                productId: databaseItem.ProductId,
                quantity: databaseItem.quantity,
                unitPrice: databaseItem.unitPrice,
                totalPrice: databaseItem.totalPrice,
                productName: (_a = databaseItem.Product) === null || _a === void 0 ? void 0 : _a.name,
                productDescription: (_b = databaseItem.Product) === null || _b === void 0 ? void 0 : _b.description
            });
        })
    });
};
exports.default = SequelizeOrderRepository;
module.exports = SequelizeOrderRepository;
