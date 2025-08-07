const express = require("express");

const {getUsers} = require('../controllers/user.controller');
const {getOneUser} = require('../controllers/user.controller');
const {deleteUser} = require('../controllers/user.controller')
const {register,login} = require('../controllers/auth.controller');
const {verifyRole} = require('../middleware/user.middleware');
const {updateUser} = require('../controllers/user.controller');
const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.get('/:id',verifyRole(['admin']),getOneUser);
router.get('/',verifyRole(['admin']),getUsers);
router.delete('/:id',verifyRole(['admin']),deleteUser);
router.patch('/:id',verifyRole(['admin']),updateUser);

module.exports = router;