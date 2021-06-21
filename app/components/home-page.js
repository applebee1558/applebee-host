import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class HomePageComponent extends Component {
    @service router
    @action
    goregister(){
        this.router.transitionTo('register');
    }
    @action
    godashboard(){
        this.router.transitionTo('dashboard');
    }
}
