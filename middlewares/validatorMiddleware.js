const { validationResult } = require('express-validator');

const validatrorMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({status: 'error', errors: errors.array()[0]});
    }
    next();
}

module.exports = validatrorMiddleware;
