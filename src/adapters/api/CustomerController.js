const { Router } = require("express");
const CustomerDTO = require("../../core/customers/dto/CustomerDTO");

const MissingPropertyError = require("../../core/common/exceptions/MissingPropertyError");
const ResourceNotFoundError = require("../../core/common/exceptions/ResourceNotFoundError");
const ResourceAlreadyExistsError = require("../../core/common/exceptions/ResourceAlreadyExistsError");

class CustomerController {
  constructor(customerManagementUseCase) {
    this.router = new Router();
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
      } catch (error) {
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
      } catch (error) {
        if (
          error instanceof MissingPropertyError ||
          error instanceof ResourceAlreadyExistsError
        ) {
          return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
      }
    });
  }
}

module.exports = CustomerController;
