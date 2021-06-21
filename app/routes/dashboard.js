import Route from '@ember/routing/route';
import { make_request } from '../libs/api-handler';
import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';

export default class DashboardRoute extends Route {
    async model(){
        var {json_data, status} = await make_request("GET", "/users/@me")
        if(status==401){
            localStorage.setItem("api-token", null)
            return this.transitionTo('login');
        }
        let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);
        return json_data
    }
    
}
