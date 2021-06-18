import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class APIAdapater extends JSONAPIAdapter {
    namespace = '/';
    host = 'https://applebee1558.com/api/host';

    get headers() {
        return {
          'Authorization': localStorage.getItem("api-key"),
          'Content-Type': 'application/json'
        };
    }
}