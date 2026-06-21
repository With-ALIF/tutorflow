import { supabase } from "../../../lib/supabase";

export const reauthenticate = async (password: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) throw new Error("No user logged in");
  
  const { error } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: password,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      throw new Error("Incorrect current password.");
    }
    throw error;
  }
};

export const updateUserEmail = async (email: string) => {
  const { error } = await supabase.auth.updateUser({ email });
  if (error) throw error;
};

export const updateUserPassword = async (password: string) => {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
};
