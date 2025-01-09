import { Router } from "express";

import CustomerDTO from "../core/customers/dto/CustomerDTO";
import CustomerController from "../controllers/CustomerController";
import SequelizeCustomerDataSource from "../external/SequelizeCustomerDataSource";
import MissingPropertyError from "../core/common/exceptions/MissingPropertyError";
import ResourceAlreadyExistsError from "../core/common/exceptions/ResourceAlreadyExistsError";
import InvalidAttributeError from "../core/common/exceptions/InvalidAttributeError";
import ResourceNotFoundError from "../core/common/exceptions/ResourceNotFoundError";

const customersAPIRouter = Router();

customersAPIRouter.get("/customers/:cpf", async (req, res) => {
  try {
    const cpf = req.params.cpf;
    const customerFound = await CustomerController.findCustomerByCpf(new SequelizeCustomerDataSource(), cpf);
    return res.status(200).json(customerFound);
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
});

customersAPIRouter.post("/customers", async (req, res) => {
  try {
    const { name, cpf, email } = req.body;
    const customerDTO = new CustomerDTO({
      name,
      cpf,
      email
    });
    const customerCreated = await CustomerController.createCustomer(new SequelizeCustomerDataSource(), customerDTO);

    return res.status(201).json(customerCreated);
  } catch (error: any) {
    if (error instanceof MissingPropertyError || error instanceof ResourceAlreadyExistsError || error instanceof InvalidAttributeError) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
});

export default customersAPIRouter;
