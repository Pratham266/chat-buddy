export const servers = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export const peerConnection = () => {
  const pc = new RTCPeerConnection(servers);
  return pc;
};
