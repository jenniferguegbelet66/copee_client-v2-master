import { FirebaseApp, initializeApp } from "firebase/app";
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  IdTokenResult,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithCustomToken,
  signInWithRedirect,
  signOut,
  User,
  UserCredential,
  sendPasswordResetEmail,
  confirmPasswordReset,
} from "firebase/auth";
import { FIREBASE_CONFIG } from "./config";
import { FirebaseAuthError } from "./data";

const firebaseInit = (): FirebaseApp => {
  const app = initializeApp(FIREBASE_CONFIG);
  return app;
};

const app: FirebaseApp = firebaseInit();
export const auth: Auth = getAuth(app);

export const firebaseConfirmPasswordReset = async (
  oobcode: string,
  password: string
) => {
  return await confirmPasswordReset(auth, oobcode, password);
};

export const firebasePasswordResetEmail = async (
  email: string
): Promise<void> => {
  return await sendPasswordResetEmail(auth, email);
};

export const firebaseSigninWithCustomToken = (
  token: string
): Promise<UserCredential> => {
  return signInWithCustomToken(auth, token);
};

export const firebaseSigninWithEmailAndPassword = (
  email: string,
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const firebaseSignupUser = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const firebaseLogoutUser = (): Promise<void> => {
  return signOut(auth);
};

export const firebaseLoginAnonymously = (): Promise<UserCredential> => {
  return signInAnonymously(auth);
};

export const firebaseLoginWithGoogle = (): Promise<void> => {
  const provider: GoogleAuthProvider = new GoogleAuthProvider();
  auth.useDeviceLanguage();
  return signInWithRedirect(auth, provider);
};

export const firebaseGetCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const firebaseGetCurrentUserIdToken = (): Promise<string> | null => {
  const user: User | null = auth.currentUser;
  if (user) {
    return user.getIdToken(/* forceRefresh */ true);
  }
  return null;
};

export const firebaseGetCurrentUserIdTokenResult = ():
  | undefined
  | Promise<IdTokenResult> => {
  return firebaseGetCurrentUser()?.getIdTokenResult();
};

export const processFirebaseAuthError = (firebaseCode: string): string => {
  let errorMessage: string = "";
  if (firebaseCode === FirebaseAuthError.FIREBASE_AUTH_USER_NOT_FOUND) {
    errorMessage = "Utilisateur non trouvé";
  }
  return errorMessage;
};
