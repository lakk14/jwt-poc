const router = require('express').Router();
const UserController = require('../Controller/User.Controller');
const { verifyAccessToken } = require('../helpers/jwt_helper');

router.get('/:email', verifyAccessToken, UserController.getUserDetails);

module.exports = router;