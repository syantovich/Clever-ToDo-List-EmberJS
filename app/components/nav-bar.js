import Component from '@glimmer/component';
import { inject } from '@ember/service';

export default class NavBarComponent extends Component {
  @inject userStore$;
}
