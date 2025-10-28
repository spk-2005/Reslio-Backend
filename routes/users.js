const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/userController');
const { authenticateAdmin } = require('../middleware/adminAuth');

router.get('/', authenticateAdmin, getAllUsers);

module.exports = router;