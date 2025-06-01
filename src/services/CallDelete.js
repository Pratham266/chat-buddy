import { deleteDoc, doc } from "firebase/firestore";
import { peerConnection } from "./webRtc";
import { db } from "./firebase";

export const endCall = async (callId) => {
  peerConnection.close();
  await deleteDoc(doc(db, "calls", callId)); // optional: clean up signaling data
};
