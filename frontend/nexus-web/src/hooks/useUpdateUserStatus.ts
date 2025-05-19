import { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_USER } from "@/graphql/user/userMutations";

export const useUpdateUserStatus = () => {
  const [updateUser] = useMutation(UPDATE_USER);

  const setOnline = async () => {
    try {
      await updateUser({ variables: { status: "online" } });
    } catch (error) {
      console.error("Failed to set user online", error);
    }
  };

  const setOffline = async () => {
    try {
      await updateUser({ variables: { status: "offline" } });
    } catch (error) {
      console.error("Failed to set user offline", error);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      // async call might not complete reliably on unload,
      setOffline();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Optional: also set offline on unmount
      setOffline();
    };
  }, []); // empty dependency array — run once on mount/unmount

  return { setOnline, setOffline };
};
