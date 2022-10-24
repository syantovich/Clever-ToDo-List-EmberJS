import Model, { attr } from '@ember-data/model';

export default class PlansModel extends Model {
  @attr days;
  @attr('string') month;
  @attr('string') user;
}
