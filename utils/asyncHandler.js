const asyncHandler = (request) => (req, res, next) =>{
    Promise.resolve(request(req, res, next))
    .catch((err) => {
        console.log(err);
        if(err.statusCode){
            res.status(err.statusCode).send({
                message : err.message,
                error : 1,
                icon : 'error',
            });
        }
        else{
            res.status(510).send({
                message : 'Error in Code Base, Programmer Error',
                problem :  err.message,
                error : 1,
                icon : 'error',
            });
        }
        
    });
}

module.exports = asyncHandler;