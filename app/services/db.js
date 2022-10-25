import Service from '@ember/service';
import { inject } from '@ember/service';
import { processingDate } from '../data/processingDate';
import { action } from '@ember/object';
import { uid } from 'uid';

export default class DbService extends Service {
  @inject store;
  @inject userStore$;
  @inject plansStore$;

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

  createRecord = async ({ date, description, name, importance }) => {
    const day = processingDate.getDay(new Date(date));
    const month = processingDate.toYearMont(new Date(date));
    const record1 = await this.store.createRecord('plans', {
      month: month,
      user: this.userStore$.user.email,
      days: {
        [day]: [
          {
            name,
            description,
            date,
            importance,
            isFinished: false,
            uid: uid(32),
          },
        ],
      },
    });
    record1.save();
  };

  getPlansInMonth = async (month) => {
    const record = await this.store.query('plans', {
      filter: {
        month: month,
        user: this.userStore$.user.email,
      },
    });
    if (record.content.length) {
      const updateRecord = await this.store.findRecord(
        'plans',
        record.content[0].id
      );
      return updateRecord.days;
    } else {
      return [];
    }
  };
  deletePlan = async (date, uid) => {
    const day = processingDate.getDay(new Date(date));
    const month = processingDate.toYearMont(new Date(date));
    const record = await this.store.query('plans', {
      filter: {
        month: month,
        user: this.userStore$.user.email,
      },
    });

    if (record.content.length) {
      const updateRecord = await this.store.findRecord(
        'plans',
        record.content[0].id
      );
      updateRecord.days[day] = updateRecord.days[day].filter(
        (e) => e.uid !== uid
      );
      await updateRecord.save();
    }
  };

  addPlan = async ({ date, description, name, importance }) => {
    const day = processingDate.getDay(new Date(date));
    const month = processingDate.toYearMont(new Date(date));

    const record = await this.store.query('plans', {
      filter: {
        month: month,
        user: this.userStore$.user.email,
      },
    });
    if (record.content.length) {
      const updateRecord = await this.store.findRecord(
        'plans',
        record.content[0].id
      );
      if (!updateRecord.days[day]) {
        updateRecord.days[day] = [];
      }
      updateRecord.days[day].push({
        name,
        description,
        date,
        importance,
        isFinished: false,
        uid: uid(32),
      });
      updateRecord.save();
    } else {
      this.createRecord({ name, description, date, importance });
    }
  };

  async updateRecord({ date, description, name, importance, isFinished, uid }) {
    const day = processingDate.getDay(new Date(date));
    const month = processingDate.toYearMont(new Date(date));
    const record = await this.store.query('plans', {
      filter: {
        month: month,
        user: this.userStore$.user.email,
      },
    });

    if (record.content.length) {
      const updateRecord = await this.store.findRecord(
        'plans',
        record.content[0].id
      );
      updateRecord.days[day] = updateRecord.days[day].map((e) => {
        if (e.uid === uid) {
          return { date, description, name, importance, isFinished, uid };
        } else {
          return e;
        }
      });
      await updateRecord.save();
    }
  }
}
