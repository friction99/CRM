const express = require("express");

const {getUsers} = require('../controllers/user.controller');
const {register,login} = require('../controllers/auth.controller');
const {verifyRole} = require('../middleware/user.middleware');

const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.get('/',verifyRole(['admin']),getUsers);

module.exports = router;