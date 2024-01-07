class Apperror extends Error   {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
        Error.captureStackTrace(this, this.constructor);
    }
}
export default Apperror;