import { useDocument } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
export default function useRoom(roomId, userId) {
  const isUserRoom = roomId?.includes(userId);
  const docId = isUserRoom ? roomId?.replace(userId, "") : roomId;
  const [docSnapshot] = useDocument(
    db.collection(isUserRoom ? "users" : "rooms").doc(docId),
  );
  if (!docSnapshot) return null;

  return {
    id: docSnapshot.id,
    photoURL:
      docSnapshot.photoURL ||
      `https://avatars.dicebear.com/api/human/${docSnapshot.id}.svg`,
    ...docSnapshot.data(),
  };
}

//   const docId = isUserRoom ? roomId?.replace(userId, "") : roomId;
//   const [docSnapshot] = useDocument(
//     db.collection(isUserRoom ? "users" : "rooms").doc(docId),
//   );
//   if (!docSnapshot) return null;

//   return {
//     id: docSnapshot.id,
//     photoURL:
//       docSnapshot.photoURL ||
//       `https://avatars.dicebear.com/api/human/${docSnapshot.id}.svg`,
//     ...docSnapshot.data(),
//   };

// }
