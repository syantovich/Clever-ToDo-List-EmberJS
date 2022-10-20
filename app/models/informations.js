import Model, { attr } from '@ember-data/model';

export default class UserinfoModel extends Model {
  @attr('string') email;
  @attr('string') name;
  @attr('string') uid;
}
