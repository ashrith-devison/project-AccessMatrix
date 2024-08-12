class ApiError extends Error{
    constructor(statusCode, message){
        super(message); //parent class constructor
        this.statusCode = statusCode;
        this.message = message;
    }

    static badRequest(){
        return new ApiError(400, 'Bad Request Deteced');
    }

    static unauthorized(){
        return new ApiError(401, 'Unauthorized');
    }

    static forbidden(){
        return new ApiError(403, 'Forbidden');
    }
}

module.exports = ApiError;