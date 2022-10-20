import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default class ProfileController extends Controller {
  @inject userStore$;
}
