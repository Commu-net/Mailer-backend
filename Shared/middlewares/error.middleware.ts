
const  errorMiddleware = (err , req ,res, next ) => {
    console.log(err);
    err.status = err.status || 500 ; 
    err.message = err.message || "Internal Server Error" ;
    res.status(err.status).json({
        status : err.status , 
        message : err.message, 
        stack : err.stack
    })
}

export default errorMiddleware ;