import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import request from "supertest";
import ResourceNotFoundError from "../../../core/common/exceptions/ResourceNotFoundError";
import ItemDTO from "../../../core/orders/dto/ItemDTO";
import OrderDTO from "../../../core/orders/dto/OrderDTO";
import { OrderPaymentsStatus } from "../../../core/orders/entities/OrderPaymentsStatus";
import { OrderStatus } from "../../../core/orders/entities/OrderStatus";
import { MercadoPagoPaymentSystem } from "../../../external/MercadoPagoPaymentSystem";
import SequelizeOrderDataSource from "../../../external/SequelizeOrderDataSource";
import app from "../../../server";

chai.use(chaiAsPromised);

describe("WebhooksAPI", () => {
  let findByIdStub: sinon.SinonStub;
  let updateOrderStub: sinon.SinonStub;
  let getPaymentDetailsStub: sinon.SinonStub;

  beforeEach(() => {
    findByIdStub = sinon.stub(SequelizeOrderDataSource.prototype, "findById");
    updateOrderStub = sinon.stub(
      SequelizeOrderDataSource.prototype,
      "updateOrder"
    );
    getPaymentDetailsStub = sinon.stub(
      MercadoPagoPaymentSystem.prototype,
      "getPaymentDetails"
    );
  });

  function createOrderDTO(customProps: {} = {}) {
    const newOrder = {
      id: 1,
      code: "1",
      customerId: 1,
      status: "CREATED",
      totalPrice: 0,
      items: [
        new ItemDTO({
          id: 1,
          quantity: 2,
          totalPrice: 10,
          unitPrice: 5,
        }),
      ],
      ...customProps,
    };
    return new OrderDTO(newOrder);
  }

  function resolvesFindOrder({
    customOrder,
    customItems,
  }: { customOrder?: Partial<OrderDTO>; customItems?: Partial<ItemDTO> } = {}) {
    const itemDTO = new ItemDTO({
      id: 1,
      quantity: 2,
      totalPrice: 10,
      unitPrice: 5,
      ...customItems,
    });
    const orderDTO = createOrderDTO({
      id: 1,
      code: "1",
      createdAt: new Date(),
      items: [itemDTO],
      ...customOrder,
    });
    findByIdStub.resolves(orderDTO);
    return orderDTO;
  }

  function resolveGetPaymentDetails(paymentDetails: {
    orderId: number;
    paymentStatus: OrderPaymentsStatus;
    paymentId: number;
  }) {
    getPaymentDetailsStub.resolves({
      externalReference: paymentDetails.orderId,
      id: paymentDetails.paymentId,
      paymentStatus: paymentDetails.paymentStatus,
      approvalDate: "2025-01-01T00:00:00.000Z",
    });
  }

  afterEach(() => {
    sinon.restore();
  });

  describe("[TOPIC] Payment", () => {
    it("should set Order payment status to 'Approved' if Payment Status is 'Approved'", async () => {
      const PAYMENT_ID = 1;

      resolvesFindOrder({
        customOrder: { status: OrderStatus.PENDING_PAYMENT },
      });
      resolveGetPaymentDetails({
        paymentId: PAYMENT_ID,
        paymentStatus: OrderPaymentsStatus.APPROVED,
        orderId: 1,
      });

      const res = await request(app)
        .post("/webhooks")
        .query({ topic: "payment", id: PAYMENT_ID });

      expect(res.status).to.equal(200);
      expect(
        updateOrderStub.calledOnceWith(
          sinon.match({
            status: OrderStatus.PAYED,
          })
        )
      ).to.be.true;
    });

    it("should not set Order payment status if Payment Status is not 'Approved'", async () => {
      const PAYMENT_ID = 1;

      resolvesFindOrder({
        customOrder: { status: OrderStatus.PENDING_PAYMENT },
      });
      resolveGetPaymentDetails({
        paymentId: PAYMENT_ID,
        paymentStatus: OrderPaymentsStatus.PENDING,
        orderId: 1,
      });

      const res = await request(app)
        .post("/webhooks")
        .query({ topic: "payment", id: PAYMENT_ID });

      expect(res.status).to.equal(200);
      expect(
        updateOrderStub.calledOnceWith(
          sinon.match({
            status: OrderStatus.PENDING_PAYMENT,
          })
        )
      ).to.be.true;
    });

    it("should throw error if payment id is not provided", async () => {
      getPaymentDetailsStub.resolves(null);

      const res = await request(app)
        .post("/webhooks")
        .query({ topic: "payment", id: 1 });

      expect(res.status).to.equal(404);
      expect(res.body.error).to.equal(
        new ResourceNotFoundError(
          ResourceNotFoundError.Resources.Payment,
          "id",
          1
        ).message
      );
    });

    it("should throw error if Order does not exist", async () => {
      findByIdStub.resolves(null);

      const res = await request(app)
        .post("/webhooks")
        .query({ topic: "payment", id: 1 });

      expect(res.status).to.equal(404);
      expect(res.body.error).to.equal(
        new ResourceNotFoundError(
          ResourceNotFoundError.Resources.Payment,
          "id",
          1
        ).message
      );
    });
  });

  describe("Unsupported topic", () => {
    it("should return 400 if topic is not supported", async () => {
      const res = await request(app).post("/webhooks").query({ topic: "foo" });

      expect(res.status).to.equal(400);
    });
  });

  describe("Unknown Error", () => {
    it("should return 500 if an unknown error occurs", async () => {
      getPaymentDetailsStub.rejects(new Error("Unknown Error"));

      const res = await request(app)
        .post("/webhooks")
        .query({ topic: "payment", id: 1 });

      expect(res.status).to.equal(500);
    });
  });
});
