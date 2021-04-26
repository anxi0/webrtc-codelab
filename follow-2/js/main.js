const mediaStreamConstraints = {
  video: true,
  //   audio: true,
};

const offerOptions = {
  offerToRecieveVideo: 1,
};

let localPeerConnection;
let remotePeerConnection;

const localVideo = document.querySelector("#localVideo");
const remoteVideo = document.querySelector("#remoteVideo");

const startButton = document.querySelector("#start");
const callButton = document.querySelector("#call");
const hangupButton = document.querySelector("#hangup");

startButton.addEventListener("click", startAction);
callButton.addEventListener("click", callAction);

let localStream;
let remoteStream;

function startAction(event) {
  startButton.disabled = true;
  navigator.mediaDevices
    .getUserMedia(mediaStreamConstraints)
    .then(gotLocalMediaStream);
}

function handleConnection(event) {
  const peerConnection = event.target;
  const iceCandidate = event.candidate;

  if (iceCandidate) {
    const newIceCandidate = new RTCIceCandidate(iceCandidate);
    const otherPeer = getOtherPeer(peerConnection);

    otherPeer.addIceCandidate(newIceCandidate).then(() => {
      console.log("addIceCandidate success!");
    });
  }
}

function handleConnectionChange(event) {
  console.log("ICE state changed", event);
}

function callAction(event) {
  callButton.disabled = true;
  hangupButton.disabled = false;

  const videotracks = localStream.getVideoTracks();
  const audiotracks = localStream.getAudioTracks();

  const servers = null;

  localPeerConnection = new RTCPeerConnection(servers);

  localPeerConnection.addEventListener("icecandidate", handleConnection);
  localPeerConnection.addEventListener(
    "iceconnectionstatechange",
    handleConnectionChange
  );

  remotePeerConnection = new RTCPeerConnection(servers);

  remotePeerConnection.addEventListener("icecandidate", handleConnection);
  remotePeerConnection.addEventListener(
    "iceconnectionstatechange",
    handleConnectionChange
  );

  remotePeerConnection.addEventListener("addstream", gotRemoteMediaStream);

  localPeerConnection.addStream(localStream);

  localPeerConnection.createOffer(offerOptions);
}

function gotLocalMediaStream(mediaStream) {
  localVideo.srcObject = mediaStream;
  localStream = mediaStream;
  trace("Received local stream.");
  callButton.disabled = false;
}

function gotRemoteMediaStream(event) {
  const mediaStream = event.stream;
  remoteVideo.srcObject = mediaStream;
  remoteStream = mediaStream;
}

function getOtherPeer(peerConnection) {
  return peerConnection === localPeerConnection
    ? remotePeerConnection
    : localPeerConnection;
}

function getPeerName(peerConnection) {
  return peerConnection === localPeerConnection
    ? "localPeerConnection"
    : "remotePeerConnection";
}

function trace(text) {
  text = text.trim();
  const now = (window.performance.now() / 1000).toFixed(3);

  console.log(now, text);
}
