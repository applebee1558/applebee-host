import Route from '@ember/routing/route';
import { make_request } from '../libs/api-handler';

export default class DashboardRoute extends Route {
    async model(){
        var {json_data, status} = await make_request("GET", "/users/@me")
        if(status==401){
            return this.transitionTo('login');
        }
        return json_data
    }
}
