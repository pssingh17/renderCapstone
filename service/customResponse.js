class Response{
    constructor(statusCode,status,message,data){
        this.status = status ? status : 'SUCCESS'
        this.message = message ? message : ''
        this.data = data ? data : ''
        this.statusCode = statusCode ? parseInt(statusCode) : 200
    }
    

    getStatusCode(){
        return this.statusCode
    }

    getStatus(){
        return this.status
    }

    getMessage(){
        return this.message
    }

    getData(){
        return this.data
    }

    getSuccessObject(){
        return {
            statusCode:this.statusCode,
            status : this.status,
            message : this.message,
            data : this.data
        }
    }

    getErrorObject(){
        return {
            statusCode:this.statusCode,
            status : this.status,
            message : this.message
        }
    }

}

module.exports = Response