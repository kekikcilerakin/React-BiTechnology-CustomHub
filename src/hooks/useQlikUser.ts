import { useState, useEffect } from "react";
import { getQlikUser } from "@/utils/getQlikUser";

export const useQlikUser = () => {
  const [username, setUsername] = useState<string>("");
  const [isUsernameLoading, setIsUsernameLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        setIsUsernameLoading(true);
        const user = await getQlikUser();
        setUsername(user);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch username:", err);
        setError("Failed to fetch username");
        setUsername("Unknown user");
      } finally {
        setIsUsernameLoading(false);
      }
    };

    fetchUsername();
  }, []);

  return { username, isUsernameLoading: isUsernameLoading, error };
};
