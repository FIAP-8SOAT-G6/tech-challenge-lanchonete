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
var _FakeOrderRepository_instances, _FakeOrderRepository_createOrderDTO;
Object.defineProperty(exports, "__esModule", { value: true });
const ItemDTO_1 = __importDefault(require("../../core/orders/dto/ItemDTO"));
const OrderDTO_1 = __importDefault(require("../../core/orders/dto/OrderDTO"));
class FakeOrderRepository {
    constructor() {
        _FakeOrderRepository_instances.add(this);
        this.orders = [];
        this.items = [];
    }
    create(orderDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status, code, customerId } = orderDTO;
            const order = {
                id: this.orders.length + 1,
                status,
                code,
                items: [],
                createdAt: new Date(),
                customerId
            };
            this.orders.push(order);
            return __classPrivateFieldGet(this, _FakeOrderRepository_instances, "m", _FakeOrderRepository_createOrderDTO).call(this, order);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = this.orders.find((order) => order.id === id);
            if (!order)
                return undefined;
            order.items = this.items.filter((item) => item.OrderId === order.id);
            return __classPrivateFieldGet(this, _FakeOrderRepository_instances, "m", _FakeOrderRepository_createOrderDTO).call(this, order);
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = this.orders.map((order) => (Object.assign(Object.assign({}, order), { items: this.items.filter((item) => item.OrderId === order.id) })));
            return (orders === null || orders === void 0 ? void 0 : orders.length) === 0 ? undefined : orders.map(__classPrivateFieldGet(this, _FakeOrderRepository_instances, "m", _FakeOrderRepository_createOrderDTO));
        });
    }
    createItem(order, itemDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: OrderId } = order;
            const { productId: ProductId, quantity, unitPrice, totalPrice } = itemDTO;
            this.items.push({
                id: this.items.length + 1,
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
            const itemIndex = this.items.findIndex((item) => item.OrderId === orderId && item.id === itemId);
            this.items.splice(itemIndex, 1);
        });
    }
    updateItem(itemId, itemDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            const itemIndex = this.items.findIndex((item) => item.id === itemId);
            this.items[itemIndex] = Object.assign(Object.assign({}, this.items[itemIndex]), itemDTO);
        });
    }
    updateOrder(orderDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = orderDTO;
            const orderIndex = this.orders.findIndex((order) => order.id === id);
            this.orders[orderIndex] = Object.assign(Object.assign({}, this.orders[orderIndex]), orderDTO);
            return Promise.resolve(__classPrivateFieldGet(this, _FakeOrderRepository_instances, "m", _FakeOrderRepository_createOrderDTO).call(this, this.orders[orderIndex]));
        });
    }
}
_FakeOrderRepository_instances = new WeakSet(), _FakeOrderRepository_createOrderDTO = function _FakeOrderRepository_createOrderDTO(databaseOrder) {
    return new OrderDTO_1.default({
        id: databaseOrder.id,
        code: databaseOrder.code,
        createdAt: databaseOrder.createdAt,
        status: databaseOrder.status,
        customerId: databaseOrder.customerId,
        items: databaseOrder.items.map((databaseItem) => new ItemDTO_1.default({
            id: databaseItem.id,
            orderId: databaseItem.OrderId,
            productId: databaseItem.ProductId,
            productName: databaseItem.productName,
            productDescription: databaseItem.productDescription,
            quantity: databaseItem.quantity,
            unitPrice: databaseItem.unitPrice,
            totalPrice: databaseItem.totalPrice
        }))
    });
};
exports.default = FakeOrderRepository;
module.exports = FakeOrderRepository;
