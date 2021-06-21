import Route from '@ember/routing/route';
import {make_request} from "../libs/api-handler"
export default class IndexRoute extends Route {
    async model(){
        const {json_data, status} = await make_request("GET", "/stats")
        if(status==200){
            json_data.nice_uptime = this.secondsToDhms(json_data.uptime)
        }
        return json_data
    }
    secondsToDhms(seconds) {
        seconds = Number(seconds);
        var d = Math.floor(seconds / (3600*24));
        var h = Math.floor(seconds % (3600*24) / 3600);
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);
        
        var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
        var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
        return dDisplay + hDisplay + mDisplay + sDisplay;
    }
}
