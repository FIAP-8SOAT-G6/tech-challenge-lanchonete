Feature: Product
  Scenario: Create a product with valid data
    Given I have a product with name "Hamburguer" and category "Lanche" and price "10.00"
    When I create the product
    Then should create product with name "Hamburguer"

  Scenario: List all products
    Given I have these products
      | name       | category | price |
      | Hamburguer | Lanche   | 10.00 |
      | Coca-Cola  | Bebida   | 5.00  |
    When I list all products
    Then should list all products
    And should list product with name "Hamburguer"
    And should list product with name "Coca-Cola"
