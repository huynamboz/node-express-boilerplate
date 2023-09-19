const { Information } = require('../models');

/**
 * Create a user
 * @param {Object} inforBody
 * @returns {Promise<Information>}
 */
const createInformation = async (inforBody) => {
	return Information.create(inforBody);
  };
module.exports = {
	createInformation,
  };