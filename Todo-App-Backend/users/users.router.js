const express = require('express');
const router = express.Router();

const usersController = require('./users.controller.js');

router.post("/signup", usersController.signup_user);

router.post("/login", usersController.login_user);

router.post("/logout", usersController.authenticate_token, usersController.logout_user);

router.post("/validateSessionToken", usersController.authenticate_token, usersController.validate_session_token);

module.exports = router;
