const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const validate = async(req, res) =>{
    const {username, password} = req.body;
    
};

module.exports = {
    validate
}