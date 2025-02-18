import axios from "axios";
import CustomerDTO from "../core/customers/dto/CustomerDTO";
import { CustomersSource } from "../interfaces/CustomersSource";
import { StatusCode } from "./StatusCode";
import { RedisClient } from "../infrastructure/cache";
import { CachedCustomer } from "../infrastructure/cache/CustomerCacheSchema";

const { CUSTOMERS_SERVICE_HOST, CUSTOMERS_SERVICE_PORT } = process.env;

const CUSTOMER_CACHE_PREFIX = "customer";
const CACHE_EXPIRATION_IN_MS = 60 * 5;

export default class CustomersService implements CustomersSource {
  constructor(private cacheClientWrapper: RedisClient) {}

  static buildCustomerServiceURL() {
    return `http://${CUSTOMERS_SERVICE_HOST}:${CUSTOMERS_SERVICE_PORT}`;
  }

  async findByCPF(cpf: string): Promise<CustomerDTO | undefined> {
    const url = `${CustomersService.buildCustomerServiceURL()}/customers/${cpf}`;
    const response = await axios.get<CustomerDTO>(url);

    if (response.status === StatusCode.NOT_FOUND) return undefined;
    if (response.status === StatusCode.INTERNAL_SERVER_ERROR) {
      console.error({
        message: `Customers Service - Internal Server Error while fetching customer with CPF ${cpf}`,
      });
      return undefined;
    }

    return Promise.resolve(this.createCustomerDTO(response.data));
  }

  async findByID(id: number): Promise<CustomerDTO | undefined> {
    const cachedCustomer = await this.getCustomerFromCache(id);
    if (cachedCustomer) return this.createCustomerDTO(cachedCustomer);

    const url = `${CustomersService.buildCustomerServiceURL()}/customers/${id}`;
    const response = await axios.get<CustomerDTO>(url);

    if (response.status === StatusCode.NOT_FOUND) return undefined;
    if (response.status === StatusCode.INTERNAL_SERVER_ERROR) {
      console.error({
        message: `Customers Service - Internal Server Error while fetching customer with ID ${id}`,
      });
      return undefined;
    }

    await this.saveCustomerToCache(response.data);

    return Promise.resolve(this.createCustomerDTO(response.data));
  }

  private async getCustomerFromCache(
    id: number
  ): Promise<CachedCustomer | undefined> {
    try {
      const cacheClient = await this.cacheClientWrapper.getClient();
      const cachedCustomer = await cacheClient.get(
        `${CUSTOMER_CACHE_PREFIX}:${id}`
      );
      const customer = cachedCustomer ? JSON.parse(cachedCustomer) : undefined;
      return customer as CachedCustomer | undefined;
    } catch (error: any) {
      console.log(
        `Could not fetch customer from cache.\nError: ${error.message}`
      );
      return undefined;
    }
  }

  private async saveCustomerToCache({
    id,
    cpf,
    name,
    email,
  }: CustomerDTO): Promise<void> {
    try {
      const cacheClient = await this.cacheClientWrapper.getClient();
      const key = `${CUSTOMER_CACHE_PREFIX}:${id}`;
      cacheClient.setEx(
        key,
        CACHE_EXPIRATION_IN_MS,
        JSON.stringify({ id, cpf, name, email })
      );
    } catch (error: any) {
      console.log(`Coult not save customer to cache.\nError: ${error.message}`);
    }
  }

  private createCustomerDTO(values: any) {
    return new CustomerDTO({
      id: Number(values.id),
      name: values.name,
      cpf: values.cpf,
    });
  }
}
