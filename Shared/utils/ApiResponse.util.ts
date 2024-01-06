class ApiResponse {
    constructor( res  :Response , statusCode: Number, message : String, data : Object) {


        res.status(statusCode).json({
            statusCode,
            message,
            data
        });
        
    }
}
export default ApiResponse;