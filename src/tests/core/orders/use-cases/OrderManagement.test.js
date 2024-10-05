const FakeProductRepository = require("../../../../adapters/database/FakeProductRepository");
const FakeOrderRepository = require("../../../../adapters/database/FakeOrderRepository");
const FakeCustomerRepository = require("../../../../adapters/database/FakeCustomerRepository");

const OrderManagement = require("../../../../core/orders/use-cases/OrderManagement");

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const OrderStatus = require("../../../../core/orders/entities/OrderStatus");

const ResourceNotFoundError = require("../../../../core/common/exceptions/ResourceNotFoundError");

const ProductDTO = require("../../../../core/products/dto/ProductDTO");
const ItemDTO = require("../../../../core/orders/dto/ItemDTO");
const EmptyOrderError = require("../../../../core/orders/exceptions/EmptyOrderError");
const CustomerDTO = require("../../../../core/customers/dto/CustomerDTO");
const OrderDTO = require("../../../../core/orders/dto/OrderDTO");
const OrderPaymentsStatus = require("../../../../core/orders/entities/OrderPaymentsStatus");

chai.use(chaiAsPromised);
const expect = chai.expect;

function setupUseCase(orderRepository, productRepository, customerRepository) {
  return new OrderManagement(orderRepository, productRepository, customerRepository);
}

function setupOrderRepository() {
  return new FakeOrderRepository();
}

function setupProductRepository() {
  return new FakeProductRepository();
}

function setupCustomerRepository() {
  return new FakeCustomerRepository();
}

const PRODUCT_DTO = new ProductDTO({
  name: "Hamburguer",
  category: "Lanche",
  description: "Hamburguer used for tests",
  price: 12.99
});

const CUSTOMER_DTO = new CustomerDTO({
  name: "John Doe",
  cpf: "11111111111",
  email: "john.doe@gmail.com"
});

let useCase, orderRepository, productRepository, customerRepository;
context("Order Management", () => {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  beforeEach(() => {
    orderRepository = setupOrderRepository();
    productRepository = setupProductRepository();
    customerRepository = setupCustomerRepository();
    useCase = setupUseCase(orderRepository, productRepository, customerRepository);
  });

  async function createCustomer() {
    return await customerRepository.create(CUSTOMER_DTO);
  }

  async function createOrderDTO() {
    const customer = await createCustomer();
    return new OrderDTO({ customerId: customer.id });
  }

  async function addItemToOrder(orderId) {
    const product = await productRepository.create(PRODUCT_DTO);
    const itemDTO = new ItemDTO({
      productId: product.id,
      quantity: 2
    });
    return await useCase.addItem(orderId, itemDTO);
  }

  describe("create order", () => {
    it("should create order with status 'CREATED'", async () => {
      const orderDTO = await createOrderDTO();
      const createdOrder = await useCase.create(orderDTO);
      expect(createdOrder).to.not.be.undefined;
      expect(createdOrder.id).to.not.be.undefined;
      expect(createdOrder.status).to.be.equals(OrderStatus.CREATED);
      expect(createdOrder.code).to.not.be.undefined;
      expect(createdOrder.elapsedTime).to.not.be.undefined;
    });

    it("should not throw an error when creating order with anonymous customer", async () => {
      const anonymousCustomerId = null;
      const orderDTO = new OrderDTO({ customerId: anonymousCustomerId });

      const createOrderPromise = useCase.create(orderDTO);
      await expect(createOrderPromise).to.not.be.eventually.rejectedWith(ResourceNotFoundError);
      const createdOrder = await createOrderPromise;
      expect(createdOrder).to.not.be.undefined;
      expect(createdOrder.customerId).to.be.null;
    });

    it("should throw an error when creating order with unexisting customer", async () => {
      const unexistingCustomerId = -1;
      const orderDTO = new OrderDTO({ customerId: unexistingCustomerId });
      await expect(useCase.create(orderDTO)).to.be.eventually.rejectedWith(ResourceNotFoundError);
    });
  });

  describe("update order", () => {
    it("should update order status by id", async () => {
      const { RECEIVED } = OrderStatus;
      const orderDTO = await createOrderDTO();
      const order = await useCase.create(orderDTO);

      await addItemToOrder(order.id);
      await useCase.checkout(order.id);
      await useCase.updateOrderStatus({ orderId: order.id, status: RECEIVED });

      const orderUpdated = await useCase.getOrder(order.id);
      expect(orderUpdated.status).to.be.equals(RECEIVED);
    });

    it("deve retornar um erro quando o pedido não existe", async () => {
      const { RECEIVED } = OrderStatus;
      const unexistingOrderId = -1;
      await expect(useCase.updateOrderStatus({ orderId: unexistingOrderId, status: RECEIVED })).to.be.eventually.rejectedWith(ResourceNotFoundError);
    });
  });

  describe("get orders", () => {
    it("should return empty object when no have orders", async () => {
      const orders = await useCase.getOrders();
      expect(orders).to.not.be.undefined;
      expect(orders.length).to.be.equals(0);
    });

    it("should return all orders", async () => {
      const orderDTO = await createOrderDTO();
      await Promise.all([useCase.create(orderDTO), useCase.create(orderDTO)]);
      const orders = await useCase.getOrders();
      expect(orders).to.not.be.undefined;
      expect(orders.length).to.be.equals(2);
    });
  });

  describe("get order", () => {
    it("should return requested order", async () => {
      const orderDTO = await createOrderDTO();
      const order = await useCase.create(orderDTO);
      const requestedOrder = await useCase.getOrder(order.id);

      expect(requestedOrder).to.not.be.undefined;
      expect(requestedOrder.id).to.be.equals(order.id);
      expect(requestedOrder.status).to.be.equals(order.status);
      expect(requestedOrder.code).to.be.equals(order.code);
    });

    it("should throw error when order does not exist", async () => {
      const unexistingOrderId = -1;
      await expect(useCase.getOrder(unexistingOrderId)).to.be.eventually.rejectedWith(ResourceNotFoundError);
    });
  });

  describe("add item", () => {
    it("should add item to order", async () => {
      const product = await productRepository.create(PRODUCT_DTO);
      const orderDTO = await createOrderDTO();
      const order = await useCase.create(orderDTO);
      const itemDTO = new ItemDTO({
        productId: product.id,
        quantity: 2
      });

      const orderWithItems = await useCase.addItem(order.id, itemDTO);

      expect(orderWithItems).to.not.be.undefined;
      expect(orderWithItems.items).to.not.be.undefined;
      expect(orderWithItems.items.length).to.be.at.least(1);

      const createdItem = orderWithItems.items[0];
      expect(createdItem.id).to.not.be.undefined;
      expect(createdItem.productId).to.be.equals(product.id);
      expect(createdItem.quantity).to.be.equals(2);
      expect(createdItem.totalPrice).to.be.equals(createdItem.quantity * product.price);
    });

    it("should throw error when order does not exist", async () => {
      const product = await productRepository.create(PRODUCT_DTO);
      const unexistingOrderId = -1;
      const itemDTO = new ItemDTO({
        productId: product.id,
        quantity: 2
      });
      await expect(useCase.addItem(unexistingOrderId, itemDTO)).to.be.eventually.rejectedWith(ResourceNotFoundError);
    });

    it("should throw error when product does not exist", async () => {
      const unexistingProductId = -1;
      const orderDTO = await createOrderDTO();
      const order = await useCase.create(orderDTO);
      const itemDTO = new ItemDTO({
        productId: unexistingProductId,
        quantity: 2
      });
      await expect(useCase.addItem(order.id, itemDTO)).to.be.eventually.rejectedWith(ResourceNotFoundError);
    });
  });

  describe("remove item", () => {
    it("should remove item from order", async () => {
      const orderDTO = await createOrderDTO();
      const order = await useCase.create(orderDTO);

      const orderWithItems = await addItemToOrder(order.id);
      const item = orderWithItems.items[0];

      await useCase.removeItem(orderWithItems.id, item.id);

      const updatedOrder = await useCase.getOrder(orderWithItems.id);
      expect(updatedOrder.items.length).to.be.equals(0);
    });
  });

  describe("update item", () => {
    it("should update item from order", async () => {
      const product = await productRepository.create(PRODUCT_DTO);
      const orderDTO = await createOrderDTO();
      const order = await useCase.create(orderDTO);
      const itemDTO = new ItemDTO({
        productId: product.id,
        quantity: 2
      });
      const orderWithItems = await useCase.addItem(order.id, itemDTO);

      const item = orderWithItems.items[0];
      const updateItemDTO = new ItemDTO({ quantity: 3 });
      const orderWithUpdatedItems = await useCase.updateItem(order.id, item.id, updateItemDTO);

      const updatedItem = orderWithUpdatedItems.items[0];
      expect(updatedItem.quantity).to.be.equals(3);
      expect(updatedItem.totalPrice).to.be.equals(3 * product.price);
    });

    it("should throw error when order does not exist", async () => {
      const product = await productRepository.create(PRODUCT_DTO);
      const unexistingOrderId = -1;
      const itemId = 1;
      const updateItemDTO = new ItemDTO({
        productId: product.id,
        quantity: 2
      });
      await expect(useCase.updateItem(unexistingOrderId, itemId, updateItemDTO)).to.be.eventually.rejectedWith(ResourceNotFoundError);
    });

    it("should throw error when item does not exist", async () => {
      const orderDTO = await createOrderDTO();
      const order = await useCase.create(orderDTO);
      const unexistingItemId = -1;
      const updateItemDTO = new ItemDTO({ quantity: 3 });
      await expect(useCase.updateItem(order.id, unexistingItemId, updateItemDTO)).to.be.eventually.rejectedWith(ResourceNotFoundError);
    });
  });

  describe("checkout", () => {
    it("should change status if order has items", async () => {
      const orderDTO = await createOrderDTO();
      const order = await useCase.create(orderDTO);
      await addItemToOrder(order.id);

      await expect(useCase.checkout(order.id)).to.not.be.eventually.rejectedWith(EmptyOrderError);
      const updatedOrder = await useCase.getOrder(order.id);

      expect(updatedOrder.status).to.not.be.equals(OrderStatus.CREATED);
    });

    it("should not change status if order has no items", async () => {
      const orderDTO = await createOrderDTO();
      const order = await useCase.create(orderDTO);

      await expect(useCase.checkout(order.id)).to.be.eventually.rejectedWith(EmptyOrderError);
      const updatedOrder = await useCase.getOrder(order.id);
      expect(updatedOrder.status).to.be.equals(OrderStatus.CREATED);
    });
  });

  describe("order payment status", () => {
    it('should return "PENDING" while the order awaits payment', async () => {
      const orderDTO = await createOrderDTO();
      const order = await useCase.create(orderDTO);

      const paymentStatus = await useCase.getPaymentStatus(order.id);
      expect(paymentStatus).to.be.equals(OrderPaymentsStatus.PENDING);
    });

    it('should return "APPROVED" after payment is made', async () => {
      const orderDTO = await createOrderDTO();
      const order = await useCase.create(orderDTO);
      await addItemToOrder(order.id);

      await useCase.checkout(order.id);

      const paymentStatus = await useCase.getPaymentStatus(order.id);
      expect(paymentStatus).to.be.equals(OrderPaymentsStatus.APPROVED);
    });
  });

  describe("get orders by priority", () => {
    it("should return empty object when no have orders", async () => {
      const orders = await useCase.getOrdersByPriority();
      expect(orders).to.not.be.undefined;
      expect(orders.length).to.be.equals(0);
    });

    it("return orders by status priority 'DONE', in 'PREPARING' and 'RECEIVED'", async () => {
      const { DONE, RECEIVED, PREPARING } = OrderStatus;

      const orderDTO = await createOrderDTO();
      const orderFirst = await useCase.create(orderDTO);
      const orderSecond = await useCase.create(orderDTO);
      const orderThird = await useCase.create(orderDTO);
      const orderFourth = await useCase.create(orderDTO);

      await addItemToOrder(orderFirst.id);
      await addItemToOrder(orderSecond.id);
      await addItemToOrder(orderThird.id); //pedido que irá ficar em aberto
      await addItemToOrder(orderFourth.id);

      await useCase.checkout(orderFirst.id);
      await useCase.checkout(orderSecond.id);
      await useCase.checkout(orderFourth.id);

      await useCase.updateOrderStatus({ orderId: orderFirst.id, status: RECEIVED });

      await useCase.updateOrderStatus({ orderId: orderSecond.id, status: RECEIVED });
      await useCase.updateOrderStatus({ orderId: orderSecond.id, status: PREPARING });

      await useCase.updateOrderStatus({ orderId: orderFourth.id, status: RECEIVED });
      await useCase.updateOrderStatus({ orderId: orderFourth.id, status: PREPARING });
      await useCase.updateOrderStatus({ orderId: orderFourth.id, status: DONE });

      const orders = await useCase.getOrdersByPriority();

      const [firstOrder, secondOrder, thirdOrder] = orders;

      expect(orders).not.to.be.undefined;
      expect(orders.length).to.be.equals(3);

      expect(firstOrder.status).to.be.equals(DONE);
      expect(secondOrder.status).to.be.equals(PREPARING);
      expect(thirdOrder.status).to.be.equals(RECEIVED);
    });

    it("should sort the requests by status and from oldest to newest", async () => {
      const { RECEIVED, PREPARING } = OrderStatus;
      const orderDTO = await createOrderDTO();

      const orderFirst = await useCase.create(orderDTO);
      await delay(10);
      const orderSecond = await useCase.create(orderDTO);
      await delay(10);
      const orderThird = await useCase.create(orderDTO);

      await addItemToOrder(orderFirst.id);
      await addItemToOrder(orderSecond.id);
      await addItemToOrder(orderThird.id);

      await useCase.checkout(orderFirst.id);
      await useCase.checkout(orderSecond.id);
      await useCase.checkout(orderThird.id);

      await useCase.updateOrderStatus({ orderId: orderFirst.id, status: RECEIVED });
      await useCase.updateOrderStatus({ orderId: orderThird.id, status: RECEIVED });
      await useCase.updateOrderStatus({ orderId: orderThird.id, status: PREPARING });
      await useCase.updateOrderStatus({ orderId: orderSecond.id, status: RECEIVED });
      await useCase.updateOrderStatus({ orderId: orderSecond.id, status: PREPARING });

      const orders = await useCase.getOrdersByPriority();

      const [first, second, third] = orders;

      expect(orders).not.to.be.undefined;
      expect(orders.length).to.be.equals(3);

      expect(first.id).to.be.equals(orderSecond.id);
      expect(first.status).to.be.equals(PREPARING);

      expect(second.id).to.be.equals(orderThird.id);
      expect(second.status).to.be.equals(PREPARING);

      expect(third.id).to.be.equals(orderFirst.id);
      expect(third.status).to.be.equals(RECEIVED);
    });

    it("should not return orders with 'Finished' status", async () => {
      const { DONE, RECEIVED, PREPARING, FINISHED } = OrderStatus;
      const orderDTO = await createOrderDTO();

      const orderFirst = await useCase.create(orderDTO);
      await addItemToOrder(orderFirst.id);
      await useCase.checkout(orderFirst.id);
      await useCase.updateOrderStatus({ orderId: orderFirst.id, status: RECEIVED });
      await useCase.updateOrderStatus({ orderId: orderFirst.id, status: PREPARING });
      await useCase.updateOrderStatus({ orderId: orderFirst.id, status: DONE });
      await useCase.updateOrderStatus({ orderId: orderFirst.id, status: FINISHED });

      await useCase.create(orderDTO);

      const orderThird = await useCase.create(orderDTO);
      await addItemToOrder(orderThird.id);
      await useCase.checkout(orderThird.id);
      await useCase.updateOrderStatus({ orderId: orderThird.id, status: RECEIVED });

      const orders = await useCase.getOrdersByPriority();
      const [order] = orders;
      expect(orders).to.not.be.undefined;
      expect(orders.length).to.be.equals(1);
      expect(order.id).to.be.equals(orderThird.id);
      expect(order.status).not.to.be.equals(FINISHED);
      expect(order.status).to.be.equals(RECEIVED);
    });
  });
});
