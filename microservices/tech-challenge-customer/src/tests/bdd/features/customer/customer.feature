
Feature: Customer
  Background: Initial setup
    Given that the database is clean
    And that the system is initialized

  Scenario: Register Customer
    Given the values provided
      | name        | Bob Bill       |
      | email       | joao@email.com |
      | cpf         | 12345678909    |
    When registering the customer
    Then return the registered customer

  Scenario: Register Customer with Invalid CPF
    Given the values provided
      | name        | Bob Bill       |
      | email       | joao@email.com |
    And cpf "12345678901" is invalid
    When registering the customer
    Then return message error equal "cpf '12345678901' provided is invalid"

  Scenario: Register customer with missing information
    Given the values provided
      | name        | Bob Bill     |
      | cpf         | 12345678909  |
    But "email" was not provided
    When registering the customer
    Then return message error equal "Missing property 'email'"

  Scenario: Search for a client
    Given the values provided
      | name        | Bob Bill       |
      | email       | joao@email.com |
      | cpf         | 35647401040    |
    When registering the customer
    And search the customer by CPF "35647401040"
    Then return the registered customer

  Scenario: Search for a customer with an invalid CPF
    When search the customer by CPF "123" invalid
    Then return message error equal "Customer not found for cpf '123'"
