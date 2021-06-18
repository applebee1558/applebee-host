import { API_URL } from "./config";

var token = localStorage.getItem("api-token")

function refresh_token(){
    token = localStorage.getItem("api-token")
}
function route_request(path){
    return API_URL + path
}

async function make_request(method, path, body=undefined, additional_headers={}){
    var headers = {"Authorization": token}
    if(typeof body == "string" || body == undefined){
        headers['Content-Type'] = "application/json"
    }
    if(additional_headers !== {}){
        Object.keys(additional_headers).forEach(function(key){
            headers[key] = additional_headers[key]
        })
    }
    var options = {
        method: method,
        headers: headers,
        body:body
    }
    try{
        var response = await fetch(route_request(path), options)
        if(response.status==204){
            return {json_data: null, status: 204}
        }
        var json_data = await response.json()
        return {json_data: json_data, status:response.status}
    }catch(error){
        return { json_data:{"message": error.toString(), "code": 4000} ,status: 500}
    }
}
export {API_URL, route_request, make_request, refresh_token, token}