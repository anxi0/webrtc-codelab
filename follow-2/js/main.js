const mediaStreamConstraints = {
  video: true,
  audio: true,
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
hangupButton.addEventListener("click", hangupAction);

let localStream;
let remoteStream;

function startAction(event) {
  startButton.disabled = true;
  navigator.mediaDevices
    .getUserMedia(mediaStreamConstraints)
    .then(gotLocalMediaStream);
}

function callAction(event) {
  callButton.disabled = true;
  hangupButton.disabled = false;

  const servers = null;

  localPeerConnection = new RTCPeerConnection(servers);
  localPeerConnection.addEventListener("icecandidate", handleConnection);

  remotePeerConnection = new RTCPeerConnection(servers);
  remotePeerConnection.addEventListener("icecandidate", handleConnection);
  remotePeerConnection.addEventListener("addstream", gotRemoteMediaStream);

  localPeerConnection.addStream(localStream);
  localPeerConnection.createOffer(offerOptions).then(createdOffer);
}

function hangupAction() {
  localPeerConnection.close();
  remotePeerConnection.close();
  localPeerConnection = null;
  remotePeerConnection = null;
  remoteVideo.srcObject = null;
  hangupButton.disabled = true;
  callButton.disabled = false;
}

function handleConnection(event) {
  const peerConnection = event.target;
  const iceCandidate = event.candidate;

  if (iceCandidate) {
    const newIceCandidate = new RTCIceCandidate(iceCandidate);
    const otherPeer = getOtherPeer(peerConnection);

    otherPeer.addIceCandidate(newIceCandidate).then(() => {
      console.log("addIce success");
    });
  }
}

function createdOffer(description) {
  localPeerConnection.setLocalDescription(description);

  remotePeerConnection.setRemoteDescription(description);
  remotePeerConnection.createAnswer().then(createdAnswer);
}

function createdAnswer(description) {
  remotePeerConnection.setLocalDescription(description);
  localPeerConnection.setRemoteDescription(description);
}

function gotLocalMediaStream(mediaStream) {
  callButton.disabled = false;
  localVideo.srcObject = mediaStream;
  localStream = mediaStream;
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
