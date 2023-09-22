const { Information } = require('../models');

/**
 * Create a user
 * @param {Object} inforBody
 * @returns {Promise<Information>}
 */
const createInformation = async (inforBody) => {
	return Information.create(inforBody);
  };
const queryInformations = async (filter, options) => {
	const informations = await Information.paginate(filter, options);
	return informations;
  }
module.exports = {
	createInformation,
	queryInformations
  };