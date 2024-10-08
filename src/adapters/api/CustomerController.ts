import { Router } from "express";
import CustomerDTO from "../../core/customers/dto/CustomerDTO";

import MissingPropertyError from "../../core/common/exceptions/MissingPropertyError";
import ResourceNotFoundError from "../../core/common/exceptions/ResourceNotFoundError";
import ResourceAlreadyExistsError from "../../core/common/exceptions/ResourceAlreadyExistsError";
import CustomerManagementPort from "../../core/ports/CustomerManagement";
import InvalidAttributeError from "../../core/common/exceptions/InvalidAttributeError";

export default class CustomerController {
  private useCase: CustomerManagementPort;
  private router: Router;

  constructor(customerManagementUseCase: CustomerManagementPort) {
    this.router = Router();
    this.useCase = customerManagementUseCase;

    this.initializeRoutes();
  }

  getRouter() {
    return this.router;
  }

  initializeRoutes() {
    this.router.get("/customers/:cpf", async (req, res) => {
      try {
        const cpf = req.params.cpf;
        const customerFound = await this.useCase.findByCPF(cpf);
        return res.status(200).json(customerFound);
      } catch (error: any) {
        if (error instanceof ResourceNotFoundError) {
          return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
      }
    });

    this.router.post("/customers", async (req, res) => {
      try {
        const { name, cpf, email } = req.body;
        const customerDTO = new CustomerDTO({
          name,
          cpf,
          email
        });
        const customerCreated = await this.useCase.create(customerDTO);

        return res.status(201).json(customerCreated);
      } catch (error: any) {
        if (
          error instanceof MissingPropertyError ||
          error instanceof ResourceAlreadyExistsError ||
          error instanceof InvalidAttributeError
        ) {
          return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
      }
    });
  }
}
