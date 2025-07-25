const express = require('express');
const registerUser = require('../controller/registerUser');
const checkEmail = require('../controller/checkEmail');
const checkPassword = require('../controller/checkPassword');
const userDetails = require('../controller/userDetails');
const logout = require('../controller/logout');
const updateUserDetails = require('../controller/updateUserDetails');
const searchUser = require('../controller/searchUser');

const router = express.Router();

//api routes
// user register route
router.post('/register', registerUser);

//user login route with checkEmail2

router.post('/email', checkEmail);

//user login route with checkPassword

router.post('/password', checkPassword);

//login user details

router.get('/user_details', userDetails);

//logout user

router.get('/logout', logout)

//update user

router.post('/update', updateUserDetails)

//search user

router.post('/search-user', searchUser)



module.exports = router;