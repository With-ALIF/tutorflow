import { useState, useEffect } from "react";
import { supabase } from "@/src/lib/supabase";

export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone_number: string | null;
  telegram_chat_id: string | null;
}

export const useUser = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setUserProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  return { userProfile, loading };
};
