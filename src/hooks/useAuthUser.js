import { auth, createTimestamp, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import React from "react";
export default function useAuthUser() {
  const [user] = useAuthState(auth);
  React.useEffect(() => {
    if (user) {
      const ref = db.collection("users").doc(user.uid);
      ref.get().then((doc) => {
        if (!doc.exists) {
          //do something
          ref.set({
            name: user.displayName,
            photoURL: user.photoURL,
            timestamp: createTimestamp(),
          });
        }
      });
    }
  }, [user]);
  return user;
}
