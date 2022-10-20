import FirestoreAdapter from 'emberfire/adapters/firestore';
import { inject } from '@ember/service';

export default FirestoreAdapter.extend({
  firebase: inject(),
  // Uncomment the following lines to enable offline persistence and multi-tab support
  enablePersistence: true,
  persistenceSettings: { synchronizeTabs: true },
});
