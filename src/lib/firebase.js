import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAyeo5c6y4tFoImJXCwzUmcRmJ7WdDvOx0",
  authDomain: "token-cac67.firebaseapp.com",
  projectId: "token-cac67",
  storageBucket: "token-cac67.firebasestorage.app",
  messagingSenderId: "915118992924",
  appId: "1:915118992924:web:bd836e832c223a5686f9d9",
  measurementId: "G-GJVLT54LLV",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export { onAuthStateChanged };

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

export const signInWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const signUpWithEmail = async (email, password, name) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (name) await updateProfile(credential.user, { displayName: name });
  return credential;
};

export const logOut = () => signOut(auth);

export const resetPassword = (email) => sendPasswordResetEmail(auth, email);

export function firebaseErrorMessage(code) {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
      return 'Invalid email or password';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/invalid-email':
      return 'Enter a valid email address';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters';
    case 'auth/too-many-requests':
      return 'Too many attempts — try again later';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed';
    case 'auth/popup-blocked':
      return 'Popup blocked — allow popups for this site';
    default:
      return 'Something went wrong — please try again';
  }
}
