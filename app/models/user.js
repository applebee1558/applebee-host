import Model, { attr } from '@ember-data/model';

export default class UserModel extends Model {
    @attr id;
    @attr username;
    @attr email;
    @attr verified;
    @attr created_at
    
}
