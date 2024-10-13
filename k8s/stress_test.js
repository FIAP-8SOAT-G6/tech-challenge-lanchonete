import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: "30s", target: 10 }, // Vá até 10 usuários em 30s
    { duration: "1m", target: 50 }, // Mantenha 50 usuários por 1m
    { duration: "30s", target: 0 } // Reduza até 0 usuários em 30s
  ]
};

export const BASE_URL = 'http://localhost:31200';
export const CUSTOMER_CPF = '94600725000';
export const CATEGORIES = [
  'Lanche',
  'Acompanhamento',
  'Bebida',
  'Sobremesa'
];

export default function () {
  let customer = getCustomer(CUSTOMER_CPF);
  if (!customer) fail("Get Customer failed. Skipping subsequent tests");

  let order = createOrder(customer.id);
  if (!order) fail("Create Order failed. Skipping subsequent tests");

  for (const category of CATEGORIES) {
    let products = getProducts(category);

    if (products && products.length > 0) {
      let product = products[Math.floor(Math.random() * products.length)];
      let quantity = Math.floor(Math.random() * 10) + 1;
      // Add item to order with random quantity
      AddItem(order.id, product.id, quantity);
    }

    sleep(1);
  }
}

export function createOrder (customerId) {
  let payload = JSON.stringify({ customerId: customerId });
  let params = { headers: { "Content-Type": "application/json" } }

  let res = http.post(`${BASE_URL}/orders`, payload, params);
  check(res, {
    "POST /orders status is 201": (r) => r.status === 201,
    "POST /orders took less than 700ms": (r) => r.timings.duration < 700
  });
    
  return res.json();
}

export function AddItem (orderId, productId, quantity) {
  let payload = JSON.stringify({ orderId: orderId, productId: productId, quantity: quantity });
  let params = { headers: { "Content-Type": "application/json" } }

  let res = http.post(`${BASE_URL}/orders/${orderId}/items`, payload, params);

  check(res, {
    "POST /orders/<order_id>/items status is 201": (r) => r.status === 201,
    "POST /orders/<order_id>/items took less than 700ms": (r) => r.timings.duration < 700
  });
}

export function getCustomer(cpf) {
  let res = http.get(`${BASE_URL}/customers/${cpf}`);

  check(res, {
    "GET /customers/<cpf> status is 200": (r) => r.status === 200,
    "GET /customers/<cpf> took less than 700ms": (r) => r.timings.duration < 700
  });

  return res.body;
}

export function getProducts (category) {
  let res = http.get(`${BASE_URL}/category/${category}/products`);

  check(res, {
    "GET /category/<category>/products status is 200": (r) => r.status === 200,
    "GET /category/<category>/products took less than 700ms": (r) => r.timings.duration < 700
  });
  
  return res.body;
}
