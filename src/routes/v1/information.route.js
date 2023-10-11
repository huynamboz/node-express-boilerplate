const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const informationValidation = require('../../validations/information.validation');
const informationController = require('../../controllers/information.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('crudInformation'), validate(informationValidation.createInformation), informationController.createInformation)
  .get(auth('crudInformation'), informationController.getInformations);

router
  .route('/all')
  .get(auth('admin'), informationController.getAllInformations);
module.exports = router;