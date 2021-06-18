import Route from '@ember/routing/route';
import { API_URL } from '../libs/config';

export default class VerifyEmailRoute extends Route {
    async model(params){
        try{
            var r = await fetch(API_URL+`/verify-email/${params.verify_token}`, {method: "POST", headers:{"content-type": "application/json"}})
            if(r.status!=204){
                var jsondata = await r.json()
                return {error: true, "message": `${jsondata.message} | Code ${jsondata.code}`}
            }else{
                console.log("email verified")
                return {error: false}
            }
        }catch(error){
            return {error: true, "message": error.toString()}
        }
    }
}
