module.exports = debug => {
  return async function create(modelData) {
    let transaction = null;
    let response = null;
    try {
      const modelInstance = this.model.build(modelData);
      debug('Creating a new Transaction to invoke save on model');
      transaction = await this.sequelize.transaction();
      const createdResource = await modelInstance.save({ transaction });
      debug('Model Successfully saved, committing transaction');
      await transaction.commit();
      debug('Transaction commited');
      response = { error: null, response: createdResource };
    } catch (error) {
      response = { error: this.sequelizeError(error), response: null };
      if (transaction != null) {
        debug('Rolling back the transaction');
        await transaction.rollback();
        debug('Transaction rolled back successfully');
      }
    }
    return response;
  };
};
