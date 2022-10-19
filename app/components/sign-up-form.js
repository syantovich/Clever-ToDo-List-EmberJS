import Component from '@ember/component';
import { validator, buildValidations } from 'ember-cp-validations';
import { inject } from '@ember/service';

const Validations = buildValidations({
  name: [validator('presence', true)],
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
  passwordConfirmation: [
    validator('presence', true),
    validator('confirmation', {
      on: 'password',
      message: 'Passwords must be identical',
      description: 'Passwordsアドレスの確認',
    }),
  ],
  email: [validator('presence', true), validator('format', { type: 'email' })],
  emailConfirmation: [
    validator('presence', true),
    validator('confirmation', {
      on: 'email',
      message: 'Emails must be identical',
      description: 'Emailsアドレスの確認',
    }),
  ],
});

export default Component.extend(Validations, {
  userStore$: inject(),

  name: null,
  password: null,
  passwordConfirmation: null,
  email: null,
  emailConfirmation: null,
});
