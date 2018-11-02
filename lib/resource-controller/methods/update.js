module.exports = debug => {
  return async function update(modelInstance, modelData) {
    let transaction;
    let response = null;
    try {
      debug('Creating a new Transaction to invoke save on model');
      transaction = await this.sequelize.transaction();
      debug('Performing update');
      const updatedResource = await modelInstance.update(modelData, { transaction });
      debug('Model Successfully updated, committing transaction');
      await transaction.commit();
      debug('Transaction commited');
      response = { error: null, response: updatedResource };
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
