import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword
} from "../../../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export const loginWithEmail = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signUpWithEmail = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return await signInWithPopup(auth, provider);
};
