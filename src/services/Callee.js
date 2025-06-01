import { db } from "./firebase.js";
import {
  doc,
  collection,
  addDoc,
  getDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { peerConnection } from "./webRtc.js";

export const joinCall = async (callId) => {
  const callRef = doc(db, "calls", callId);
  const offerCandidates = collection(callRef, "offerCandidates");
  const answerCandidates = collection(callRef, "answerCandidates");

  const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  const remoteStream = new MediaStream();

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      addDoc(answerCandidates, event.candidate.toJSON());
    }
  };

  const callDoc = await getDoc(callRef);
  const callData = callDoc.data();

  const offerDesc = new RTCSessionDescription(callData.offer);
  await peerConnection.setRemoteDescription(offerDesc);

  const answerDesc = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answerDesc);

  await updateDoc(callRef, {
    answer: {
      type: answerDesc.type,
      sdp: answerDesc.sdp,
    },
  });

  onSnapshot(offerCandidates, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const data = change.doc.data();
        peerConnection.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });

  return { localStream, remoteStream };
};
