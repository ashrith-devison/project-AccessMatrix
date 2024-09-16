class ApiError extends Error{
    constructor(
        statusCode,
        message = "Internal Server Error",
        error = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }

    static badRequest(message = "Bad Request", errors = []){
        return new ApiError(400, message, errors)
    }
    static unauthorized(message = "Unauthorized", errors = []){
        return new ApiError(401, message, errors)
    }
    static forbidden(message = "Forbidden", errors = []){
        return new ApiError(403, message, errors)
    }
}

export { ApiError };