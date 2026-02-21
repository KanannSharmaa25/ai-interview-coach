import admin from 'firebase-admin';

let firebaseApp: admin.app.App | null = null;

export function getFirebaseAdmin(): admin.app.App | null {
  if (firebaseApp) return firebaseApp;
  const cred = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!cred) return null;
  try {
    const parsed = JSON.parse(cred) as admin.ServiceAccount;
    firebaseApp = admin.apps.length ? (admin.app() as admin.app.App) : admin.initializeApp({ credential: admin.credential.cert(parsed) });
    return firebaseApp;
  } catch {
    return null;
  }
}

export async function verifyIdToken(token: string): Promise<admin.auth.DecodedIdToken | null> {
  const app = getFirebaseAdmin();
  if (!app) return null;
  try {
    return await admin.auth().verifyIdToken(token);
  } catch {
    return null;
  }
}
