import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject } from '@ember/service';
import firebase from 'firebase';

export default class UserStore$Service extends Service {
  @inject store;
  @inject session;
  @inject firebaseApp;
  @inject db;
  @inject loadingStore$;

  @tracked user = this.session.data.authenticated.user;

  get isAuth() {
    return !!this.user;
  }

  @action
  async login({ email, password }) {
    this.loadingStore$.setLoading(true);
    const auth = await this.firebaseApp.auth();

    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      this.user = result.user;
      this.db.getUserInfoByEmail(email);
    } catch (e) {
      console.log(e);
    }
    this.loadingStore$.setLoading(false);
  }

  @action
  async signup({ email, password, name }) {
    this.loadingStore$.setLoading(true);
    const auth = await this.firebaseApp.auth();

    try {
      const result = await auth.createUserWithEmailAndPassword(email, password);
      this.db.setUserInfo({
        email,
        uid: result.user.uid,
        name,
      });
    } catch (e) {
      console.log(e);
    }
    this.loadingStore$.setLoading(false);
  }

  @action
  async googleAuth() {
    this.loadingStore$.setLoading(true);
    const auth = await this.firebaseApp.auth();
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await auth.signInWithPopup(provider);
      this.user = result.user;
    } catch (e) {
      console.log(e);
    }
    this.loadingStore$.setLoading(false);
  }

  @action
  logout() {
    return this.session.invalidate();
  }
}
