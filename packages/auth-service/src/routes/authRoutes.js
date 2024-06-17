const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();
const { body } = require('express-validator');
console.log('teste');
router.post('/register', 
    [
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],
    register
);

router.post('/login', 
    [
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('password').exists().withMessage('Password is required')
    ], 
    login
);

module.exports = router;