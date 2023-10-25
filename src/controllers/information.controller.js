const httpStatus = require('http-status');
const { sendNotifyToTelegram } = require('../utils/telegram');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
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
	const dateFormat = new Date(infor.createdAt);
	const dateConverted = `${dateFormat.getDate()}/${dateFormat.getMonth()+1}/${dateFormat.getFullYear()} 
	- ${dateFormat.getHours()}h:${dateFormat.getMinutes()}p:${dateFormat.getSeconds()}s`;
	sendNotifyToTelegram(`<b>-- User gửi thông tin mới -- </b>
	<b>Tên:</b>  <pre>${user.name} </pre>
	<b>Email:</b>  <pre>${user.email} </pre>
	<b>Ngày sinh:</b> <pre>${infor.birthday}</pre>
	<b>Giới tính:</b> <pre>${infor.gender}</pre>
	<b>Nhận bằng:</b> <pre>${infor.location}</pre>
	<b>SDT nhận:</b> <pre>${infor.phone_number}</pre>
	<b>Số dư:</b> <pre>${user.balance}</pre>
	<b>Tạo lúc:</b> <pre>${dateConverted}</pre>`);
	res.status(httpStatus.CREATED).send(infor);
  });

const getInformations = catchAsync(async (req, res) => {
	const filter = { user: req.user.id };
	const options = pick(req.query, ['sortBy', 'limit', 'page']);
	const result = await informationService.queryInformations(filter, options);
	res.send(result);
});

const getAllInformations = catchAsync(async (req, res) => {
  const filter = {};
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await informationService.queryInformations(filter, options);
  res.send(result);
});

  module.exports = {
	createInformation,
	getInformations,
  getAllInformations
  };