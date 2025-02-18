Feature: Create Order

Scenario: Create an order with existing customer
    Given I am an anonymous user
    When I create an order
    Then should create order with status 'CREATED'

Scenario: Create an order with existing customer
    Given I am customer 'Alice'
    When I create an order
    Then should create order with status 'CREATED'
    And should create order associated with me


Scenario: Create an order with unexisting customer
    Given I am customer 'John'
    When I create an order
    Then should not create an order
    And should return missing customer error