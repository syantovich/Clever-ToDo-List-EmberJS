import Component from '@ember/component';
import { validator, buildValidations } from 'ember-cp-validations';
import { inject } from '@ember/service';

const Validations = buildValidations({
  password: [
    validator('presence', true),
    validator('length', {
      min: 4,
      max: 25,
    }),
    validator('length', {
      isWarning: true,
      min: 6,
      message: 'Password is weak',
    }),
  ],
  email: [validator('presence', true), validator('format', { type: 'email' })],
});

export default Component.extend(Validations, {
  password: null,
  email: null,
  userStore$: inject(),
});
