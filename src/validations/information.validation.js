const Joi = require('joi');

const createInformation = {
	body: Joi.object().keys({
		name: Joi.string().required(),
		birthDate: Joi.string().required(),
		gender: Joi.string().required().valid('nam', 'nữ'),
		location: Joi.string().required().valid('telegram', 'zalo'),
		isSend: Joi.boolean().default(false),
	}),
  };
module.exports = {
	createInformation,
};