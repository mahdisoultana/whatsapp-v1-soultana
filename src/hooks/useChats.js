import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase.jsx";
export default function useChats(user) {
  //users/user.uid/chats
  const [snapshot] = useCollection(
    user
      ? db
          .collection("users")
          .doc(user.uid)
          .collection("chats")
          .orderBy("timestamp", "desc")
      : null,
  );
  let chats = snapshot?.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return chats;
}
