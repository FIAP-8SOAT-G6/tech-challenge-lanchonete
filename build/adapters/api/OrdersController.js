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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const EmptyOrderError_1 = __importDefault(require("../../core/orders/exceptions/EmptyOrderError"));
const ClosedOrderError_1 = __importDefault(require("../../core/orders/exceptions/ClosedOrderError"));
const ResourceNotFoundError_1 = __importDefault(require("../../core/common/exceptions/ResourceNotFoundError"));
const ItemDTO_1 = __importDefault(require("../../core/orders/dto/ItemDTO"));
const OrderDTO_1 = __importDefault(require("../../core/orders/dto/OrderDTO"));
class OrdersController {
    constructor(orderUseCase) {
        this.router = (0, express_1.Router)();
        this.useCase = orderUseCase;
        this.initializeRoutes();
    }
    getRouter() {
        return this.router;
    }
    initializeRoutes() {
        this.router.post("/orders", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const orderDTO = new OrderDTO_1.default({ customerId: req.body.customerId });
                const order = yield this.useCase.create(orderDTO);
                return res.status(201).json(order);
            }
            catch (error) {
                if (error instanceof ResourceNotFoundError_1.default)
                    return res.status(400).json({ error: error.message });
                return res.status(500).json({ error: error.message });
            }
        }));
        this.router.get("/orders", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield this.useCase.getOrders();
                return res.status(200).json(order);
            }
            catch (error) {
                return res.status(500).json({ error: error.message });
            }
        }));
        this.router.get("/orders/:orderId", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const orderId = Number(req.params.orderId);
                const order = yield this.useCase.getOrder(orderId);
                return res.status(201).json(order);
            }
            catch (error) {
                if (error instanceof ResourceNotFoundError_1.default)
                    return res.status(404).json({ error: error.message });
                return res.status(500).json({ error: error.message });
            }
        }));
        this.router.post("/orders/:orderId/items", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const orderId = Number(req.params.orderId);
                const { productId, quantity } = req.body;
                const addItemDTO = new ItemDTO_1.default({ productId, quantity });
                const order = yield this.useCase.addItem(orderId, addItemDTO);
                return res.status(201).json(order);
            }
            catch (error) {
                if (error instanceof ResourceNotFoundError_1.default)
                    return res.status(404).json({ error: error.message });
                if (error instanceof ResourceNotFoundError_1.default ||
                    error instanceof ClosedOrderError_1.default)
                    return res.status(400).json({ error: error.message });
                return res.status(500).json({ error: error.message });
            }
        }));
        this.router.delete("/orders/:orderId/items/:itemId", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId, itemId } = req.params;
                yield this.useCase.removeItem(Number(orderId), Number(itemId));
                return res.status(204).json({});
            }
            catch (error) {
                if (error instanceof ResourceNotFoundError_1.default)
                    return res.status(404).json({ error: error.message });
                if (error instanceof ClosedOrderError_1.default)
                    return res.status(400).json({ error: error.message });
                return res.status(500).json({ error: error.message });
            }
        }));
        this.router.put("/orders/:orderId/items/:itemId", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId, itemId } = req.params;
                const { quantity } = req.body;
                const updateItemDTO = new ItemDTO_1.default({ quantity });
                const updatedOrder = yield this.useCase.updateItem(Number(orderId), Number(itemId), updateItemDTO);
                return res.status(200).json(updatedOrder);
            }
            catch (error) {
                if (error instanceof ResourceNotFoundError_1.default)
                    return res.status(404).json({ error: error.message });
                if (error instanceof ClosedOrderError_1.default)
                    return res.status(400).json({ error: error.message });
                return res.status(500).json({ error: error.message });
            }
        }));
        this.router.post("/orders/:orderId/checkout", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const orderId = Number(req.params.orderId);
                yield this.useCase.checkout(orderId);
                return res.status(200).json({});
            }
            catch (error) {
                if (error instanceof EmptyOrderError_1.default)
                    return res.status(400).json({ error: error.message });
                return res.status(500).json({ error: error.message });
            }
        }));
    }
}
exports.default = OrdersController;
module.exports = OrdersController;
