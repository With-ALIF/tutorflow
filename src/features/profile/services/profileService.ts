import { 
  auth 
} from "../../../firebase";
import { 
  updateEmail, 
  updatePassword, 
  EmailAuthProvider, 
  reauthenticateWithCredential 
} from "firebase/auth";

export const reauthenticate = async (password: string) => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("No user logged in");
  const credential = EmailAuthProvider.credential(user.email, password);
  await reauthenticateWithCredential(user, credential);
};

export const updateUserEmail = async (email: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user logged in");
  await updateEmail(user, email);
};

export const updateUserPassword = async (password: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user logged in");
  await updatePassword(user, password);
};
