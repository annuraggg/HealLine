const express = require('express');
const router = express.Router();
const {hello,postUserData,getUserData} = require('../controllers/UserController');

router.route('/').get(hello);
router.route('/user-dashboard').post(postUserData);
router.route('/get-user-data').get(getUserData);
// 6rRl3cNtRSuZ3qAzQsEntw   -- id
// DqVpaJLEAYb7EIVmk8EVVa66pO7K1TD8  --secret
module.exports = router;