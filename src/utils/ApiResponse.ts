class ApiResponse<T>{
    success : boolean
    message : string
    data : T | null

    constructor(message : string, data : T | null = null){
        this.success = true
        this.message = message
        this.data = data
    }
}

export default ApiResponse