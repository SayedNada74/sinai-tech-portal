// Simulated Firebase user type
export interface FirebaseUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

// Simulated Firebase Realtime Database class
class MockFirebaseDB {
  // Sync settings to Firebase /users/{uid}/settings/
  async syncSettings(uid: string, settings: { lang: string; theme: string; lowPowerMode: boolean }) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Save to a mock store representing Firebase DB in localStorage
    const firebaseMockDb = JSON.parse(localStorage.getItem("su_firebase_mock_db") || "{}");
    firebaseMockDb[uid] = {
      ...(firebaseMockDb[uid] || {}),
      settings
    };
    localStorage.setItem("su_firebase_mock_db", JSON.stringify(firebaseMockDb));
    console.log(`[Firebase DB] Synced settings for user ${uid}:`, settings);
  }

  // Load settings from Firebase on login (overrides localStorage)
  async loadSettings(uid: string): Promise<{ lang: "ar" | "en"; theme: "dark" | "light"; lowPowerMode: boolean } | null> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    const firebaseMockDb = JSON.parse(localStorage.getItem("su_firebase_mock_db") || "{}");
    if (firebaseMockDb[uid] && firebaseMockDb[uid].settings) {
      console.log(`[Firebase DB] Loaded settings for user ${uid}:`, firebaseMockDb[uid].settings);
      return firebaseMockDb[uid].settings;
    }
    return null;
  }
}

export const firebaseDb = new MockFirebaseDB();
