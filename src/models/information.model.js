const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const genderEnum = ['nam', 'nữ']
const locationRecieve = ['telegram', 'zalo']
const informationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    birthday: {
      type: String,
      required: true,
      trim: true,
    },
	gender: {
		type: String,
		required: true,
		enums: genderEnum,
		trim: true,
	  },
	  user: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'User',
		required: true,
	  },
	location: {
		type: String,
		required: true,
		enums: locationRecieve,
		trim: true,
	  },
  phone_number: {
    type: String,
    required: true,
    trim: true,
  },
	isSend: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	}
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
informationSchema.plugin(toJSON);
informationSchema.plugin(paginate);


/**
 * @typedef User
 */
const Information = mongoose.model('Informations', informationSchema);

module.exports = Information;
