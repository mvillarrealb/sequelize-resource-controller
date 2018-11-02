module.exports = debug => {
  return async function findOne(modelIds) {
    let response = null;
    try {
      debug('Validating not existing attributes in requested object %o', modelIds);
      const nonExistingAttributes = Object.keys(modelIds).filter(
        attribute => !this.attributeExists(attribute)
      );
      if (nonExistingAttributes.length > 0) {
        const errorMessage = `The following find attributes are unsupported by the resource ${nonExistingAttributes.join(',')}`;
        throw this.resourceError(this.ERROR_CODES.INVALID_ARGUMENT, errorMessage);
      }
      const result = await this.model.findOne({ where: modelIds });
      if (result == null) {
        throw this.resourceError(this.ERROR_CODES.NOT_FOUND, 'Model not Found for requested Ids');
      }
      response = { error: null, response: result };
    } catch (error) {
      response = { error: this.sequelizeError(error), response: null };
    }
    return response;
  };
};
