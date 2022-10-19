import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default class SignInController extends Controller {
  @inject router;
  @inject userStore$;
  @inject session;
  @inject firebaseApp;
}
