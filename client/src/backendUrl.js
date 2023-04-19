let mode = "Production"
// let mode = "Production"
let BACKEND_URL
if(mode === "Production"){
    BACKEND_URL = ""
}
else{
    BACKEND_URL = `http://localhost:8081`
}

export default BACKEND_URL