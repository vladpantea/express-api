module.exports = class DBOperationError{
    constructor(message, err){
        this.message = message;
        this.err = err;
    }
}