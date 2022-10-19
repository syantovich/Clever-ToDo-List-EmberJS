import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default class ProfileRoute extends Route {
  @inject userStore$;
  @inject router;

  redirect() {
    if (!this.userStore$.isAuth) {
      this.router.transitionTo('sign.in');
    }
  }
}
