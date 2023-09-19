const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { informationService } = require('../services');
const { userService } = require('../services');
/**
 * Create a information
 * @param {Object} informationBody
 * @returns {Promise<Information>}
 */
const createInformation = catchAsync(async (req, res) => {
	req.body.user = req.user.id;
	const user = await userService.getUserById(req.user.id);
	if (user.balance - 130000 < 0) {
	  throw new ApiError(httpStatus.NOT_FOUND, 'Not enough money');
	}
	user.balance -= 130000;
	await user.save();
	const infor = await informationService.createInformation(req.body);
	infor.user = user;
	res.status(httpStatus.CREATED).send(infor);
  });

  module.exports = {
	createInformation,
  };