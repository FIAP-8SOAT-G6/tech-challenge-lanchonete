import axios from "axios";
import CustomersService from "./CustomersService";
import ProductsService from "./ProductsService";
import { StatusCode } from "./StatusCode";

const REGEX = new RegExp(/http:\/\/[a-zA-Z]+:\d+/);

function authenticateServiceURL(url: string): boolean {
  return REGEX.test(url);
}

export async function authenticateDependenciesAvailability() {
  const productsServiceUrl = ProductsService.buildProductsServiceURL();
  const customersServiceUrl = CustomersService.buildCustomerServiceURL();

  if (
    !authenticateServiceURL(productsServiceUrl) ||
    !authenticateServiceURL(customersServiceUrl)
  )
    return false;

  const [productsResponse, customersResponse] = await Promise.all([
    axios.get(`${productsServiceUrl}/health`),
    axios.get(`${customersServiceUrl}/health`),
  ]);

  return (
    productsResponse.status === StatusCode.OK &&
    productsResponse.status === StatusCode.OK
  );
}
