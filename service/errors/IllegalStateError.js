class IllegalStateError extends Error{
    constructor(message){
        super(message)
        this.statusCode=500
        this.status = "FAILURE"
    }
}

module.exports = IllegalStateError