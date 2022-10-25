import Route from '@ember/routing/route';

export default class PlansRoute extends Route {
  model() {
    return {
      date: null,
      name: null,
      description: '',
      importance: null,
    };
  }
}
