import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default class SignInRoute extends Route {
  @inject store;
}
