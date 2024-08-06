const Item = require("../../core/orders/entities/Item");
const { sequelize } = require("../../infrastructure/database/models");

const { Item: SequelizeItem } = sequelize.models;

class SequelizeItemRepository {
  async create(itemsAttributes) {   
    if (!Array.isArray(itemsAttributes)) {
      throw new Error('items must be an array');
    }
    
    let items = itemsAttributes.map(item => {
      const { productId, orderId, quantity, unitPrice, totalPrice } = item.toHash();
    });

    const createdItems = await SequelizeItem.bulkCreate(items, {
      // TODO Checar se isso é necessário
      validate: true, // Ensures model validations are run
      returning: true // Required for PostgreSQL to return created rows
    });
    
    return this.#instantiateItems(createdItems);
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

// TODO Acho que aqui o código tá ok. Ainda tô muito na dúvida sobre a motivação dessa conversão de hash pra entity e entity pra hash toda hora. Precisamos melhorar isso