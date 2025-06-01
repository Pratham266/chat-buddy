import {
  doc,
  setDoc,
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { peerConnection } from "./webRtc";

export const createCall = async (callId, callerId, calleeId) => {
  const callRef = doc(db, "calls", callId);
  const offerCandidates = collection(callRef, "offerCandidates");
  const answerCandidates = collection(callRef, "answerCandidates");

  const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  const remoteStream = new MediaStream();

  // Add local tracks to peer connection
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  // Handle remote tracks
  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  // Collect ICE candidates and push to Firestore
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      addDoc(offerCandidates, event.candidate.toJSON());
    }
  };

  // Create offer
  const offerDescription = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offerDescription);

  // Save call info to Firestore
  await setDoc(callRef, {
    caller: callerId,
    callee: calleeId,
    offer: {
      type: offerDescription.type,
      sdp: offerDescription.sdp,
    },
    timestamp: Date.now(),
  });

  // Listen for answer
  onSnapshot(callRef, (snapshot) => {
    const data = snapshot.data();
    if (!peerConnection.currentRemoteDescription && data?.answer) {
      const answerDesc = new RTCSessionDescription(data.answer);
      peerConnection.setRemoteDescription(answerDesc);
    }
  });

  // Listen for answer candidates
  onSnapshot(answerCandidates, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const candidate = new RTCIceCandidate(change.doc.data());
        peerConnection.addIceCandidate(candidate);
      }
    });
  });

  return { localStream, remoteStream };
};
