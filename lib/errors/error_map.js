/**
 * Error status codes map
 * INTERNAL_CODE:HTTP_CODE
 * based on google design guideliness for error status codes
 *
 * https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
 *
 */
module.exports = {
  OK: { code: 200, status: 'OK' },
  INVALID_ARGUMENT: { code: 400, status: 'INVALID_ARGUMENT' },
  FAILED_PRECONDITION: { code: 412, status: 'FAILED_PRECONDITION' },
  OUT_OF_RANGE: { code: 400, status: 'OUT_OF_RANGE' },
  UNAUTHENTICATED: { code: 401, status: 'UNAUTHENTICATED' },
  PERMISSION_DENIED: { code: 403, status: 'PERMISSION_DENIED' },
  NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
  ABORTED: { code: 409, status: 'ABORTED' },
  ALREADY_EXISTS: { code: 409, status: 'ALREADY_EXISTS' },
  RESOURCE_EXHAUSTED: { code: 429, status: 'RESOURCE_EXHAUSTED' },
  CANCELLED: { code: 499, status: 'CANCELLED' },
  DATA_LOSS: { code: 500, status: 'DATA_LOSS' },
  UNKNOWN: { code: 500, status: 'UNKNOWN' },
  INTERNAL: { code: 500, status: 'INTERNAL' },
  NOT_IMPLEMENTED: { code: 501, status: 'NOT_IMPLEMENTED' },
  UNAVAILABLE: { code: 503, status: 'UNAVAILABLE' },
  DEADLINE_EXCEEDED: { code: 504, status: 'DEADLINE_EXCEEDED' }
};
