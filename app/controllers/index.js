import Controller from '@ember/controller';
import { inject } from '@ember/service';
import { action } from '@ember/object';

export default class IndexController extends Controller {
  @inject userStore$;
  @inject router;

  @action
  nav() {
    if (this.userStore$.isAuth) {
      this.router.transitionTo('plans');
    } else {
      this.router.transitionTo('sign.in');
    }
  }
}
