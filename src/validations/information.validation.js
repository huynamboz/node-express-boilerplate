const Joi = require('joi');

const createInformation = {
	body: Joi.object().keys({
		name: Joi.string().required(),
		birthday: Joi.string().required(),
		gender: Joi.string().required().valid('nam', 'nữ'),
		location: Joi.string().required().valid('telegram', 'zalo'),
    phone_number: Joi.string().required(),
		isSend: Joi.boolean().default(false),
	}),
  };
module.exports = {
	createInformation,
};