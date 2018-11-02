module.exports = debug => {
  return async function findAll({
    limit = 10,
    offset = 0,
    sortOrder = null,
    sortField = null
  } = {}) {
    let response = null;
    let requestArguments = {};
    try {
      const isNumber = /\d+/;
      debug(`Validating limit and offsets parameters limit:${limit} offset:${offset}`);
      if (!isNumber.test(limit) || !isNumber.test(offset)) {
        throw this.resourceError(
          this.ERROR_CODES.INVALID_ARGUMENT,
          `Limit ${limit} or offset ${offset} are not numbers`
        );
      } else if (limit <= 0 || limit > 100) {
        throw this.resourceError(
          this.ERROR_CODES.INVALID_ARGUMENT,
          `Limit ${limit} is lower than zero(0) or is greater than 100(limit per page)`
        );
      } else if (offset < 0) {
        throw this.resourceError(
          this.ERROR_CODES.INVALID_ARGUMENT,
          'Negative offset is unsupported'
        );
      }
      requestArguments = { limit, offset };

      debug('Validating sortOrder and sortfield parameters');

      if (sortOrder != null && sortField != null) {
        if (!this.attributeExists(sortField)) {
          throw this.resourceError(
            this.ERROR_CODES.INVALID_ARGUMENT,
            `Unsupported resource attribute ${sortField}`
          );
        } else if (!this.sortOrderSupported(sortOrder)) {
          throw this.resourceError(
            this.ERROR_CODES.INVALID_ARGUMENT,
            `Unsupported sort order ${sortOrder}`
          );
        }
        requestArguments.order = [[sortField, sortOrder]];
      }

      debug('Executing findAll with parameters %o ', requestArguments);
      const results = await this.model.findAll(requestArguments);
      debug('Successfully found resources, formatting pagingInfo');

      const first = { limit, offset: 0 };
      const next = results.length < limit ? null : { limit, offset: offset + limit };
      const previous = offset > 0 ? { limit, offset: offset - limit } : null;

      const formattedResponse = {
        rows: results.map(instance => instance.get({ plain: true })),
        paging: { first, next, previous }
      };
      debug('Successfully resolved paging info, resolving promise');
      response = { error: null, response: formattedResponse };
    } catch (error) {
      response = { error: this.sequelizeError(error), response: null };
    }
    return response;
  };
};
