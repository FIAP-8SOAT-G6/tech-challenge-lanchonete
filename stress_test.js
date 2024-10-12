import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 1000,
  duration: '1m',
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
  let order = createOrder(customer.id);

  CATEGORIES.forEach(category => {
    let products = getProducts(category);

    if (products.length > 0) {
      let product = products[Math.floor(Math.random() * products.length)];
      let quantity = Math.floor(Math.random() * 10) + 1;

      // Add item to order with random quantity
      AddItem(order.id, product.id, quantity);
    }

    sleep(1);
  });
}

export function createOrder (customerId) {
  let payload = JSON.stringify({ customerId: customerId });
  let params = { headers: { "Content-Type": "application/json" } }

  let res = http.post(`${BASE_URL}/orders`, payload, params);
  return JSON.parse(res.json());
}

export function AddItem (orderId, productId, quantity) {
  let payload = JSON.stringify({ orderId: orderId, productId: productId, quantity: quantity });
  let params = { headers: { "Content-Type": "application/json" } }

  return http.post(`${BASE_URL}/orders/${orderId}/items`, payload, params);
}

export function getCustomer(cpf) {
  let res = http.get(`${BASE_URL}/customers/${cpf}`);

  return JSON.parse(res.body);
}

export function getProducts (category) {
  let res = http.get(`${BASE_URL}/category/${category}/products`);

  return JSON.parse(res.body);
}
