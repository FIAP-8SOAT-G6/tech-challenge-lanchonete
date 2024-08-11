const ItemDTO = require("../../core/orders/dto/ItemDTO");
const OrderDTO = require("../../core/orders/dto/OrderDTO");
const { sequelize } = require("../../infrastructure/database/models");
const order = require("../../infrastructure/database/models/order");
const SequelizeCustomerRepository = require("./SequelizeCustomerRepository");

const {
  Order: SequelizeOrder,
  Item: SequelizeItem,
  Product: SequelizeProduct
} = sequelize.models;

class SequelizeOrderRepository {
  async create(orderAttributes) {
    const { status, code, CustomerId } = orderAttributes;

    const repository = new SequelizeCustomerRepository()
    const customer = await repository.findById(CustomerId);
    const { id, cpf, name, email } = customer;

    const createdOrder = await SequelizeOrder.create({ status, code, CustomerId });
    
    // return this.#instantiateOrder(createdOrder, { id, cpf, name, email });
    
    return this.#createOrderDTO(createdOrder);
  }

  async findById(id) {
    const order = await SequelizeOrder.findByPk(id, {
      include: [
        {
          model: SequelizeItem,
          include: [SequelizeProduct]
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
        }
      ]
    });

    return orders?.length === 0 ? undefined : orders.map(this.#createOrderDTO);

    // TODO voltar aqui
    //return orders?.length === 0
    //  ? undefined
    //  : orders.map(this.#instantiateOrder).sort((a, b) => a.createdAt - b.createdAt);
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

  async update(orderDTO) {
    const { code, status, customer } = order;
    const createdOrder = await SequelizeOrder.create({
      code,
      status
    });
    return this.#createOrderDTO(createdOrder);
  }

  #createOrderDTO(databaseOrder) {
    return new OrderDTO({
      id: databaseOrder.id,
      code: databaseOrder.code,
      status: databaseOrder.status,
      totalPrice: databaseOrder.totalPrice,
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

  // #instantiateOrder(orderAttributes, customerAttributes = {}) {
  //   const order = new Order({
  //     id: orderAttributes.id,
  //     status: orderAttributes.status,
  //     code: orderAttributes.code,
  //     totalPrice: orderAttributes.totalPrice,
  //     createdAt: orderAttributes.createdAt,
  //     CustomerId: orderAttributes.CustomerId,
  //   });
// 
  //   if (customerAttributes && Object.keys(customerAttributes).length !== 0) {
  //     order.setCustomer(customerAttributes);
  //   }
  //   // const customerAttributes = orderAttributes.Customer?
  //   // orderAttributes.Customer?.id && order.setCustomer(orderAttributes.Customer.id);
  //   orderAttributes.Items?.forEach((item) => {
  //     const {
  //       id,
  //       OrderId: orderId,
  //       ProductId: productId,
  //       quantity,
  //       unitPrice,
  //     } = item;
  //     order.addItem({
  //       id,
  //       orderId,
  //       productId,
  //       quantity,
  //       unitPrice,
  //       productName: item.Product?.name,
  //       productDescription: item.Product?.description,
  //     });
  //   });
// 
  //   // TODO: Add to a decorator + test (wait for DTO disussion)
  //   const minutes = Math.floor(order.getElapsedTime() / 60000);
  //   let response = 0
// 
  //   if (minutes < 60) {
  //     response = `${minutes} minute${minutes === 1 ? '' : 's'}`;
  //   } else {
  //     const hours = Math.floor(minutes / 60);
  //     response = `${hours} hour${hours === 1 ? '' : 's'}`;
  //   }
// 
  //   order["elapsedTime"] = response;
  //   return order;
  // }
}

module.exports = SequelizeOrderRepository;
