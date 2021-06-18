import Route from '@ember/routing/route';

export default class DashboardRoute extends Route {
    async model(){
        console.log(this.store.findRecord("user", "@me"))
    }
}
