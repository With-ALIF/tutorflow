import { 
  auth 
} from "../../../firebase";
import { 
  updatePassword, 
  EmailAuthProvider, 
  reauthenticateWithCredential,
  updateEmail
} from "firebase/auth";

export const reauthenticate = async (password: string) => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("No user logged in");
  
  // Check if the user has a password provider
  const isEmailUser = user.providerData.some(p => p.providerId === 'password');
  if (!isEmailUser) {
    throw new Error("This operation is only supported for email/password accounts.");
  }

  const credential = EmailAuthProvider.credential(user.email, password);
  try {
    await reauthenticateWithCredential(user, credential);
  } catch (error: any) {
    if (error.code === 'auth/invalid-credential') {
      throw new Error("Incorrect current password.");
    }
    throw error;
  }
};

export const updateUserEmail = async (email: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user logged in");
  
  try {
    // FORCE direct update. If this fails with 'operation-not-allowed', 
    // it's a Firebase Console limitation that only the user can fix.
    await updateEmail(user, email);
  } catch (error: any) {
    if (error.code === 'auth/operation-not-allowed') {
      throw new Error("Direct update is blocked. To fix: Go to Firebase Console -> Authentication -> Settings -> User actions -> Scroll down to 'Email address change' -> Select 'Update immediately' and Save.");
    }
    throw error;
  }
};

export const updateUserPassword = async (password: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user logged in");
  await updatePassword(user, password);
};
