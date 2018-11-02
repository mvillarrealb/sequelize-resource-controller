const debug = require('debug')('sequelize-resource:base-rest-controller');
const ResourceController = require('../resource-controller/ResourceController');
const ResourceError = require('../errors/ResourceError');
/**
 *
 * @class BaseRestController
 * @author Marco Villarreal
 */
class BaseRestController {
  /**
   *
   * @constructor
   * @param {Sequelize} sequelize
   * @param {Sequelize.Model} model
   */
  constructor(sequelize, model) {
    this.resource = new ResourceController(sequelize, model);
    this.model = model;
    this.baseURL = null;
  }

  checkJsonHeader(req) {
    debug(`Unimplemented checkJsonHeader method on request ${req}`);
    throw new ResourceError(ResourceError.ERRORS.INTERNAL, 'Unimplemented checkJsonHeader method');
  }

  async create(req, res) {
    if (this.checkJsonHeader(req)) {
      const { error, response } = await this.resource.create(req.body);
      if (error) {
        this.sendResponse(res, error.code, error);
      } else {
        this.sendResponse(res, 201, this.attachResourceLink(response.get({ plain: true }), req));
      }
    } else {
      const error = new ResourceError(
        ResourceError.ERRORS.FAILED_PRECONDITION,
        'Request body must be application/json'
      );
      this.sendResponse(res, error.code, error);
    }
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   */
  async list(req, res) {
    const { sortField, sortOrder } = req.query;
    const requestArgs = { sortField, sortOrder };
    let { limit, offset } = req.query;
    if (limit != null) {
      limit = parseInt(limit, 10);
      requestArgs.limit = limit;
    }

    if (offset != null) {
      offset = parseInt(offset, 0);
      requestArgs.offset = offset;
    }

    const { error, response } = await this.resource.findAll(requestArgs);

    if (error) {
      this.sendResponse(res, error.code, error);
    } else {
      this.sendResponse(res, 200, this.attachResourcesLinks(response, req));
    }
  }

  async getOne(req, res) {
    const { error, response } = await this.resource.findOne(req.params);
    if (error) {
      this.sendResponse(res, error.code, error);
    } else {
      const resource = this.attachResourceLink(response.get({ plain: true }), req);
      this.setHeaders(res, { Location: resource.links.self.href });
      this.sendResponse(res, 200, resource);
    }
  }

  async getOneMiddleware(req, res, next) {
    const { response, error } = await this.resource.findOne(req.params);
    if (error) {
      this.sendResponse(res, error.code, error);
    } else {
      req.resource = response;
      next();
    }
  }

  async destroy(req, res) {
    if (!req.resource) {
      this.setStatus(res, 412);
      this.response(res, null);
    }
    const { response, error } = await this.resource.destroy(req.resource);
    if (error) {
      this.sendResponse(res, error.code, error);
    } else {
      this.sendResponse(res, 200, response);
    }
  }

  async update(req, res) {
    if (this.checkJsonHeader(req)) {
      if (!req.resource) {
        this.setStatus(res, 412);
        this.response(res, null);
      } else {
        const { response, error } = await this.resource.update(req.resource, req.body);
        if (error) {
          this.sendResponse(res, error.code, error);
        } else {
          this.sendResponse(res, 200, this.attachResourceLink(response));
        }
      }
    } else {
      const error = new ResourceError(
        ResourceError.ERRORS.FAILED_PRECONDITION,
        'Request body must be application/json'
      );
      this.sendResponse(res, error.code, error);
    }
  }

  /**
   *
   * @method attachResourceLink
   * @param {Object} resource
   * @param {Request} requestObj
   * @return {Object}
   */
  attachResourceLink(resource, requestObj) {
    const linkedResource = resource;
    try {
      const baseURL = this.createHATEOABaseURL(requestObj);
      const primaryKeys = this.resource.primaryKey.map(attribute => linkedResource[attribute]);
      const href = `${baseURL}/${primaryKeys.join('/')}`;
      linkedResource.links = {
        self: { href }
      };
    } catch (error) {
      debug('Error found attaching resource link %o', error);
    }

    return linkedResource;
  }

  /**
   * @method attachResourcesLinks
   * @param {Object} paginatedResources
   * @param {Request} requestObj
   * @return {Object}
   */
  attachResourcesLinks(paginatedResources, requestObj) {
    const pagingInfo = paginatedResources.paging;
    const baseURL = this.createHATEOABaseURL(requestObj);
    const { first, next, previous } = pagingInfo;

    const firstLink =
      first != null ? `${baseURL}?limit=${first.limit}&offset=${pagingInfo.first.offset}` : null;
    const nextLink =
      next != null ? `${baseURL}?limit=${next.limit}&offset=${pagingInfo.next.offset}` : null;
    const previousLink =
      previous != null ? `${baseURL}?limit=${previous.limit}&offset=${previous.offset}` : null;

    const linkedResources = paginatedResources.rows.map(dataRow =>
      this.attachResourceLink(dataRow, requestObj)
    );

    return {
      rows: linkedResources,
      links: {
        first: firstLink,
        next: nextLink,
        previous: previousLink
      }
    };
  }
}

module.exports = BaseRestController;
