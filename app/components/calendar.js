import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject } from '@ember/service';

export default class CalendarComponent extends Component {
  @inject loadingStore$;
  @inject plansStore$;
  @inject userStore$;
  @tracked indexActive = 0;

  @action
  onScroll(ev) {
    if (
      ev.target.scrollWidth - ev.target.scrollLeft - ev.target.clientWidth <
        200 &&
      !this.loadingStore$.isLoading
    ) {
      this.plansStore$.addDays();
    }
  }
}
