// it('should return "PENDING" while the order awaits payment', async () => {
//   const createOrderUseCase = setupCreateOrderUseCase();
//   const getPaymentStatus = setupGetPaymentStatusUseCase();

//   const orderDTO = await createOrderDTO();
//   const order = await createOrderUseCase.createOrder(orderDTO);

//   const paymentStatus = await getPaymentStatus.getPaymentStatus(order.id!);
//   expect(paymentStatus).to.be.equals(OrderPaymentsStatus.PENDING);
// });

// it('should return "PENDING" while the order awaits payment', async () => {
//   const createOrderUseCase = setupCreateOrderUseCase();
//   const getPaymentStatus = setupGetPaymentStatusUseCase();

//   const orderDTO = await createOrderDTO();
//   const order = await createOrderUseCase.createOrder(orderDTO);

//   const paymentStatus = await getPaymentStatus.getPaymentStatus(order.id!);
//   expect(paymentStatus).to.be.equals(OrderPaymentsStatus.PENDING);
//   expect(() => order.setStatus(OrderStatus.PAYED)).to.not.throw(ForbiddenPaymentStatusChangeError);
// });
