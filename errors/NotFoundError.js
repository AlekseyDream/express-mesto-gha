const { ERROR_CODE } = require('../utils/constants');

module.exports = class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE.NOT_FOUND;
  }
};
