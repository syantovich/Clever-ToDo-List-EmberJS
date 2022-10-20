import Service from '@ember/service';
import { inject } from '@ember/service';

export default class DbService extends Service {
  @inject store;
  async getUserInfoByEmail(email) {
    const promiseId = await this.store.query('informations', {
      filter: { email },
    });
    const id = promiseId.content[0].id;
    const userInfo = await this.store.find('informations', id);
    return userInfo;
  }
  async setUserInfo(info) {
    const record = await this.store.createRecord('informations', info);
    await record.save();
    return true;
  }
}
