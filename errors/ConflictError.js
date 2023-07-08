const { ERROR_CODE } = require('../utils/constants');

module.exports = class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE.CONFLICT_STATUS;
  }
};
