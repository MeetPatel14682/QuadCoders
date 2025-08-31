class ApiResponse{
    constructor(statuscode,message="Operation successful",data) {
        this.data = data; // Initialize data to the provided value
        this.statuscode = statuscode; // Set the HTTP status code  
        this.message = message; // Set the message for the response
        this.success = statuscode < 400; // Indicates that the operation was successful
    }

}

export default ApiResponse;