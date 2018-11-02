module.exports = debug => {
  return async function destroy(modelInstance) {
    let transaction;
    let response = null;
    try {
      debug('Creating a new Transaction to invoke save on model');
      transaction = await this.sequelize.transaction();
      const deletedResource = await modelInstance.destroy({ transaction });
      debug('Model Successfully updated, committing transaction');
      await transaction.commit();
      debug('Transaction commited');
      response = { error: null, response: deletedResource };
    } catch (error) {
      debug('Failed to destroy the model');
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
