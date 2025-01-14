class ApiResponse{
    constructor(statusCode,data,message = "Success", success=true){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = success;
    }

    static success(res,data,message){
        return res.status(200).json(new ApiResponse(201,data,message))
    }

    static error(res,message,statusCode = 400, success = false,data=null){
        return res.status(statusCode).json(
            new ApiResponse(statusCode,data,message,success))
    }
}

export { ApiResponse };