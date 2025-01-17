import * as assert from "assert";

import { When, Then } from "@cucumber/cucumber";
import { Greeter } from "./../greeter";

interface MyWorld {
  whatIHeard: string;
}
//O nome definido no When e no Then, devem ser os mesmos definidos no arquivo .feature

When("the greeter says hello", function (this: MyWorld) {
  this.whatIHeard = new Greeter().sayHello();
});

Then("I should have heard {string}", function (this: MyWorld, expectedResponse: string) {
  assert.equal(this.whatIHeard, expectedResponse);
});
