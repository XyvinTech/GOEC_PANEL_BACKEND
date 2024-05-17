import * as admin from 'firebase-admin';

import { serviceAccount } from '../serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET,
});

console.log('Firebase Initialized');
const bucket = admin.storage().bucket();
