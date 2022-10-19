import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject } from '@ember/service';
import firebase from 'firebase';

export default class UserStore$Service extends Service {
  @inject session;
  @inject firebaseApp;

  @tracked user = this.session.data.authenticated.user;

  get isAuth() {
    return !!this.user;
  }

  @action
  async login({ email, password }) {
    const auth = await this.firebaseApp.auth();

    console.log({ email, password });
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      this.user = result.user;
      this.firebaseApp.setDoc();
    } catch (e) {}
  }

  @action
  async signup({ email, password, name }) {
    const auth = await this.firebaseApp.auth();

    console.log({ email, password });
    try {
      const result = await auth.createUserWithEmailAndPassword(email, password);
    } catch (e) {}
  }

  @action
  async googleAuth() {
    const auth = await this.firebaseApp.auth();
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await auth.signInWithPopup(provider);
      this.user = result.user;
    } catch (e) {
      console.log(e);
    }
  }

  @action
  logout() {
    return this.session.invalidate();
  }
}
