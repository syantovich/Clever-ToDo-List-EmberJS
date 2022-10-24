import Component from '@ember/component';
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
  name: null,
  description: '',
  importance: null,
  date: null,
  radioImportance: [
    { value: 'not_matter', label: "doesn't matter" },
    { value: 'important', label: 'important' },
    { value: 'very_important', label: 'very important' },
  ],
  db: inject(),
});
