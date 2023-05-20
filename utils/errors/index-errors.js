const BadRequestError = require('./bad-request-error');
const UnauthorizedError = require('./unauthorized-error');
const ForbiddenError = require('./forbidden-error');
const NotFoundError = require('./not-found-error');
const ConflictError = require('./conflict-error');
const InternalServerError = require('./internal-server-error');

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
};
