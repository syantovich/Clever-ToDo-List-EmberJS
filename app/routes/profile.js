import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default class ProfileRoute extends Route {
  @inject userStore$;
  @inject router;
  @inject db;

  redirect() {
    if (!this.userStore$.isAuth) {
      this.router.transitionTo('sign.in');
    }
  }

  model() {
    return this.userStore$.user.displayName
      ? {
          name: this.userStore$.user.displayName,
          email: this.userStore$.user.email,
          uid: this.userStore$.user.uid,
        }
      : this.db.getUserInfoByEmail(this.userStore$.user.email);
  }
}
