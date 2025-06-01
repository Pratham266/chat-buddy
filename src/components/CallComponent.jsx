import React, { useEffect, useRef, useState } from "react";
import {
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { sortUserIdString } from "../helper/createUniqueString";
import Modal from "./Modal";
import { Icon } from "../IconsMap";

const CallComponent = ({ currentUser, otherUser }) => {
  const currentUserId = currentUser?.code;
  const otherUserId = otherUser?.code;
  const otherUserName = otherUser?.username;

  const [incomingCall, setIncomingCall] = useState(false);
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const pcRef = useRef(null);
  const callDocId = sortUserIdString(`${currentUserId}${otherUserId}`);
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  useEffect(() => {
    const callDoc = doc(db, "calls", callDocId);

    const unsub = onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data();

      if (data?.status === "canceled") {
        hangUp();
        setIncomingCall(false);
        setIsCallStarted(false);
        setIsCallAccepted(false);
        stopTheCameraStream();
      }
      if (data?.status === "ringing" && data?.to === currentUserId) {
        setIncomingCall(true); // Show incoming call UI
      }
      // When call is accepted by the other user
      if (data?.status === "accepted") {
        setIncomingCall(false);
        setIsCallStarted(false);
        setIsCallAccepted(true);
      }
    });
    return unsub;
  }, []);

  const createPeerConnection = () => {
    return new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
  };

  const stopTheCameraStream = () => {
    if (localVideoRef.current?.srcObject) {
      const tracks = localVideoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      localVideoRef.current.srcObject = null;
    }
  };

  const setupMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideoRef.current.srcObject = stream;
    return stream;
  };

  const startCall = async () => {
    const stream = await setupMedia();
    pcRef.current = createPeerConnection();

    stream
      .getTracks()
      .forEach((track) => pcRef.current.addTrack(track, stream));

    const remote = new MediaStream();
    remoteVideoRef.current.srcObject = remote;

    pcRef.current.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remote.addTrack(track);
      });
    };

    const callDoc = doc(db, "calls", callDocId);
    const offerCandidates = collection(callDoc, "offerCandidates");
    const answerCandidates = collection(callDoc, "answerCandidates");

    pcRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(offerCandidates, event.candidate.toJSON());
      }
    };

    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);

    await setDoc(callDoc, { offer });
    await setDoc(callDoc, {
      offer,
      status: "ringing",
      from: currentUserId,
      to: otherUserId,
    });

    onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data();
      if (data?.answer && !pcRef.current.currentRemoteDescription) {
        const answerDesc = new RTCSessionDescription(data.answer);
        pcRef.current.setRemoteDescription(answerDesc);
      }
    });

    onSnapshot(answerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          pcRef.current.addIceCandidate(candidate);
        }
      });
    });
  };

  const answerCall = async () => {
    const stream = await setupMedia();
    pcRef.current = createPeerConnection();

    stream
      .getTracks()
      .forEach((track) => pcRef.current.addTrack(track, stream));

    const remote = new MediaStream();
    remoteVideoRef.current.srcObject = remote;

    pcRef.current.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remote.addTrack(track);
      });
    };

    const callDoc = doc(db, "calls", callDocId);
    const offerCandidates = collection(callDoc, "offerCandidates");
    const answerCandidates = collection(callDoc, "answerCandidates");

    pcRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(answerCandidates, event.candidate.toJSON());
      }
    };

    const callSnap = await getDoc(callDoc);
    const callData = callSnap.data();

    const offerDesc = new RTCSessionDescription(callData.offer);
    await pcRef.current.setRemoteDescription(offerDesc);

    const answer = await pcRef.current.createAnswer();
    await pcRef.current.setLocalDescription(answer);
    const offer = await pcRef.current.createOffer();
    await updateDoc(callDoc, { answer });
    await setDoc(callDoc, {
      offer,
      status: "accepted",
      from: currentUserId,
      to: otherUserId,
    });
    onSnapshot(offerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          pcRef.current.addIceCandidate(candidate);
        }
      });
    });
  };

  const hangUp = async () => {
    pcRef.current?.close();
    pcRef.current = null;
    await deleteDoc(doc(db, "calls", callDocId));
  };

  const cancelCall = async () => {
    await updateDoc(doc(db, "calls", callDocId), {
      status: "canceled",
    });
    hangUp();
  };

  return (
    <>
      <button
        className=" cursor-pointer p-1.5 rounded-lg border border-[#9333ea] hover:bg-[#e5d8f5]"
        onClick={() => {
          startCall();
          setIsCallStarted(true);
        }}
      >
        <Icon name="videocall" size={20} color="#9333ea" />
      </button>

      {!isCallStarted && !isCallAccepted && incomingCall && (
        <>
          <Modal showfooter={false} showHeader={false} bsClass={"top-10"}>
            <div className="relative z-10 flex flex-col items-center px-8 py-12 call-gradient justify-center">
              {/* <!-- Caller Info --> */}
              <div className="text-center mb-8">
                <div className="w-32 h-32 mx-auto mb-6 overflow-hidden rounded-full border-4 border-white/20 pulse-animation">
                  <img
                    src="Avatar.jpeg"
                    alt="Caller"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h1 className="text-3xl font-bold">{otherUserName}</h1>
                <p className="text-2xl font-medium mt-6 blink">
                  Incoming Call ...
                </p>
              </div>

              {/* <!-- Call Duration (Shows when answered) --> */}
              <div
                className="text-xl font-medium mb-8 hidden"
                id="call-duration"
              >
                00:02:18
              </div>

              {/* <!-- Call Buttons --> */}
              <div className="w-full flex justify-center space-x-8">
                {/* <!-- Decline Button --> */}
                <button
                  className="flex flex-col items-center"
                  onClick={() => {
                    setIncomingCall(false);
                    setIsCallStarted(false);
                    setIsCallAccepted(false);
                    cancelCall();
                  }}
                >
                  <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors cursor-pointer animate-bounce">
                    <Icon name="hangup" size={30} />
                  </div>

                  <span className="text-sm mt-2">Decline</span>
                </button>

                {/* <!-- Answer Button --> */}
                <button
                  className="flex flex-col items-center"
                  onClick={() => {
                    setIncomingCall(false);
                    setIsCallStarted(false);
                    setIsCallAccepted(true);
                    answerCall();
                  }}
                  id="answer-btn"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors cursor-pointer animate-bounce">
                    <Icon name="calling" size={30} />
                  </div>
                  <span className="text-sm mt-2">Answer</span>
                </button>
              </div>
            </div>
          </Modal>
        </>
      )}

      {!isCallAccepted && !incomingCall && isCallStarted && (
        <Modal showfooter={false} showHeader={false} bsClass={"top-10"}>
          <div className="relative z-10 flex flex-col items-center px-8 py-12 call-gradient justify-center">
            {/* <!-- Caller Info --> */}
            <div className="text-center mb-8">
              <div className="w-32 h-32 mx-auto mb-6 overflow-hidden rounded-full border-4 border-white/20 pulse-animation">
                <img
                  src="Avatar.jpeg"
                  alt="Caller"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-3xl font-bold">{otherUserName}</h1>
              <p className="text-2xl font-medium mt-6 blink" id="call-status">
                Ringing ...
              </p>
            </div>

            {/* <!-- Call Duration (Shows when answered) --> */}
            <div className="text-xl font-medium mb-8 hidden" id="call-duration">
              00:02:18
            </div>

            {/* <!-- Call Buttons --> */}
            <div className="w-full flex justify-center space-x-8">
              {/* <!-- Decline Button --> */}
              <button
                className="flex flex-col items-center"
                onClick={() => {
                  setIncomingCall(false);
                  setIsCallStarted(false);
                  setIsCallAccepted(false);
                  cancelCall();
                }}
              >
                <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors cursor-pointer animate-bounce">
                  <Icon name="hangup" size={30} />
                </div>
                <span className="text-sm mt-2">Decline</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      <Modal
        showfooter={false}
        showHeader={false}
        extraClass={
          !incomingCall && !isCallStarted && isCallAccepted
            ? "visible "
            : "invisible"
        }
        bsClass={"top-10 "}
      >
        <div className="relative z-10 flex flex-col items-center call-gradient justify-center">
          {/* <!-- Caller Info --> */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full border "
          />
          <div className=" absolute bottom-0 w-full flex justify-end space-x-8 mb-2 mr-2">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-38 h-50 border-4 border-purple-500 border-4 border-double shadow-xl/30"
            />
          </div>
          {/* <!-- Call Buttons --> */}
          <div className=" absolute bottom-0 left-3 w-full flex  space-x-8">
            {/* <!-- Decline Button --> */}
            <button
              className="flex flex-col items-center mb-2"
              onClick={() => {
                setIncomingCall(false);
                setIsCallStarted(false);
                setIsCallAccepted(false);
                cancelCall();
              }}
            >
              <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors cursor-pointer animate-bounce">
                <Icon name="hangup" size={30} />
              </div>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CallComponent;
