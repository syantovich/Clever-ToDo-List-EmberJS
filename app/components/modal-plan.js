import Component from '@glimmer/component';
import { processingDate } from '../data/processingDate';

export default class ModalPlanComponent extends Component {
  default = {
    date: this.args.plan.date,
    name: this.args.plan.name,
    description: this.args.plan.description,
    importance: this.args.plan.importance,
    isFinished: this.args.plan.isFinished,
    uid: this.args.plan.uid,
  };
}
