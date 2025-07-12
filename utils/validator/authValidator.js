const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/user.model');

exports.registerValidator = [
    
    check('name')
        .notEmpty()
        .withMessage('name required')
        .isLength({ min: 3 })
        .withMessage('Too short name'),
    

    
    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email')
        .custom((val) =>
            User.findOne({ email: val }).then((user) => {
                    if (user) {
                    return Promise.reject(new Error('Email already exists'));
                    }
        })
        ),

    check('password')
        .notEmpty()
        .withMessage('Password required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
    validatorMiddleware,
];

exports.loginValidator = [
    check('email')
        .notEmpty()
        .withMessage('Email required')
        .isEmail()
        .withMessage('Invalid email address'),

    check('password')
        .notEmpty()
        .withMessage('Password required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    


    validatorMiddleware,
];
