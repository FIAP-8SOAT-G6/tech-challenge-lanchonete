const Item = require("../../core/orders/entities/Item");

class FakeItemRepository {
  #items = [];

  async bulkCreate(items) {
    const createdItems = items.map( item => ({
      productId: item.productId,
      orderId: item.orderId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice
    }));

    return Promise.resolve(this.#instantiateItems(createdItems));
  }

  #instantiateItems(modelItems) {
    return modelItems.map(modelItem => new Item(
      modelItem.id,
      modelItem.productId,
      modelItem.orderId,
      modelItem.quantity,
      modelItem.unitPrice,
      modelItem.totalPrice
    ));
  }
}

module.exports = FakeProductRepository;
