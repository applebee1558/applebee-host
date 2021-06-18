import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class UserAdapter extends JSONAPIAdapter {
    //namespace = 'users';
    host = 'https://applebee1558.com/api/host';

    get headers() {
        return {
          'Authorization': localStorage.getItem("api-token"),
          'Content-Type': 'application/json'
        };
    }
}
