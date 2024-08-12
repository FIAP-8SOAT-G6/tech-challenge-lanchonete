const ItemDTO = require("../../core/orders/dto/ItemDTO");
const OrderDTO = require("../../core/orders/dto/OrderDTO");
const { sequelize } = require("../../infrastructure/database/models");
const order = require("../../infrastructure/database/models/order");

const {
  Order: SequelizeOrder,
  Item: SequelizeItem,
  Product: SequelizeProduct, 
  Customer: SequelizeCustomer
} = sequelize.models;

class SequelizeOrderRepository {
  async create(orderDTO) {
    const { status, code, customerId } = orderDTO; 
    const createdOrder = await SequelizeOrder.create({ status, code, CustomerId: customerId });
       
    return this.#createOrderDTO(createdOrder);
  }

  async findById(id) {
    const order = await SequelizeOrder.findByPk(id, {
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
    return order ? this.#createOrderDTO(order) : undefined;
  }

  async findAll() {
    const orders = await SequelizeOrder.findAll({
      include: [
        {
          model: SequelizeItem,
          include: [SequelizeProduct]
        }, 
        {
          model: SequelizeCustomer
        }
      ], 
      order: [['createdAt', 'DESC']]
    });

    return orders?.length === 0 ? undefined : orders.map(this.#createOrderDTO);
  }

  async createItem(order, itemDTO) {
    const orderModel = await SequelizeOrder.findByPk(order.id);
    const {
      id,
      orderId: OrderId,
      productId: ProductId,
      quantity,
      unitPrice,
      totalPrice
    } = itemDTO;
    await orderModel.createItem({
      id,
      OrderId,
      ProductId,
      quantity,
      unitPrice,
      totalPrice
    });
  }

  async removeItem(orderId, itemId) {
    const order = await SequelizeOrder.findByPk(orderId);
    await order.removeItem(itemId);
  }

  async updateItem(itemId, itemDTO) {
    const item = await SequelizeItem.findByPk(itemId);
    await item.update(itemDTO);
  }

  async updateOrder(orderDTO) {
    const { id, code, status } = orderDTO;
    const order = await SequelizeOrder.findByPk(id);
    const updatedOrder = order.update({ code, status });
    return this.#createOrderDTO(updatedOrder);
  }

  #createOrderDTO(databaseOrder) {
    return new OrderDTO({
      id: databaseOrder.id,
      createdAt: databaseOrder.createdAt,
      code: databaseOrder.code,
      status: databaseOrder.status,
      totalPrice: databaseOrder.totalPrice,
      customerId: databaseOrder.CustomerId,
      customerName: databaseOrder.Customer?.name,
      items: databaseOrder.Items?.map(
        (databaseItem) =>
          new ItemDTO({
            id: databaseItem.id,
            orderId: databaseItem.OrderId,
            productId: databaseItem.ProductId,
            quantity: databaseItem.quantity,
            unitPrice: databaseItem.unitPrice,
            totalPrice: databaseItem.totalPrice,
            productName: databaseItem.Product?.name,
            productDescription: databaseItem.Product?.description
          })
      )
    });
  }
}

module.exports = SequelizeOrderRepository;
