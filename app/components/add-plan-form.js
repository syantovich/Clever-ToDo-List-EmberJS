import Component from '@ember/component';
import { computed } from '@ember/object';
import { validator, buildValidations } from 'ember-cp-validations';
import { inject } from '@ember/service';

const Validations = buildValidations({
  name: [
    validator('presence', true),
    validator('length', {
      min: 3,
      max: 25,
    }),
  ],

  importance: [validator('presence', true)],
  date: [validator('presence', true)],
});

export default Component.extend(Validations, {
  name: computed(function () {
    return this?.default.name || null;
  }),

  description: computed(function () {
    return this?.default.description || '';
  }),
  importance: computed(function () {
    const value = this.default.importance?.value;
    return this.radioImportance.find((e) => value === e.value) || null;
  }),
  date: computed(function () {
    return this?.default.date || null;
  }),
  isFinished: computed(function () {
    return this?.default.isFinished || null;
  }),
  uid: computed(function () {
    return this?.default.uid;
  }),
  radioImportance: [
    { value: 'not_matter', label: "doesn't matter" },
    { value: 'important', label: 'important' },
    { value: 'very_important', label: 'very important' },
  ],
  db: inject(),
  plansStore$: inject(),
});
