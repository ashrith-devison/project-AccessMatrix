class ApiResponse{
    constructor(statusCode,data,message = "Success"){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400
    }

    static success(res,data,message){
        return res.status(200).json(new ApiResponse(201,data,message))
    }

    static error(res,message,statusCode = 400){
        return res.status(statusCode).json(new ApiResponse(statusCode,null,message))
    }
}

export { ApiResponse };