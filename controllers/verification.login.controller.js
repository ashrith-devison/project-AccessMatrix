const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const validate = async(req, res) =>{
    const {username, password} = req.body;
    throw ApiError.unauthorized();
};

module.exports = {
    validate
}