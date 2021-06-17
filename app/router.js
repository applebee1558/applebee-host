import EmberRouter from '@ember/routing/router';
import config from 'applebee-host/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('register');
  this.route('verify-email', {path: "/verify-email/:verify_token"});
});
