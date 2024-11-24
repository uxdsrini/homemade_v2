import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCNHWkjru9rL-zRkSVveGvCpxEs6niQ984",
  authDomain: "homemade-19c8d.firebaseapp.com",
  projectId: "homemade-19c8d",
  storageBucket: "homemade-19c8d.firebasestorage.app",
  messagingSenderId: "756431533342",
  appId: "1:756431533342:web:11a4294bb2ef54670e850f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Firestore indexes
async function createIndexes() {
  try {
    // Add necessary indexes for queries
    const indexes = [
      {
        collectionGroup: 'recipes',
        queryScope: 'COLLECTION',
        fields: [
          { fieldPath: 'status', order: 'ASCENDING' },
          { fieldPath: 'category', order: 'ASCENDING' },
          { fieldPath: 'createdAt', order: 'DESCENDING' }
        ]
      },
      {
        collectionGroup: 'orders',
        queryScope: 'COLLECTION',
        fields: [
          { fieldPath: 'userId', order: 'ASCENDING' },
          { fieldPath: 'createdAt', order: 'DESCENDING' }
        ]
      }
    ];

    // Note: In a production environment, you would create these indexes
    // through the Firebase Console or using the Firebase CLI
    console.log('Indexes configuration ready');
  } catch (error) {
    console.error('Error configuring indexes:', error);
  }
}

createIndexes();