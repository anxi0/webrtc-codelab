"use strict";

var localConnection;
var remoteConnection;
var sendChannel;
var receiveChannel;
var pcConstraint;
var dataConstraint;
var dataChannelSend = document.querySelector("textarea#dataChannelSend");
var dataChannelReceive = document.querySelector("textarea#dataChannelReceive");
var startButton = document.querySelector("button#start");
var sendButton = document.querySelector("button#send");
var closeButton = document.querySelector("button#close");

startButton.onclick = createConnection;
sendButton.onclick = sendData;
closeButton.onclick = closeDataChannels;

function enableStartButton() {
  startButton.disabled = false;
}

function disableSendButton() {
  sendButton.disabled = true;
}

function createConnection() {
  startButton.disabled = true;
  sendButton.disabled = false;
  dataChannelSend.disabled = false;
  dataChannelSend.placeholder = "";
  closeButton.disabled = false;
  localConnection = new RTCPeerConnection();
  sendChannel = localConnection.createDataChannel(
    "sendDataChannel",
    dataConstraint
  );
  localConnection.onicecandidate = iceCallback1;
  localConnection.onopen = onSendChannelStateChange;
  localConnection.onclose = onSendChannelStateChange;

  remoteConnection = new RTCPeerConnection();
  remoteConnection.onicecandidate = iceCallback2;
  remoteConnection.ondatachannel = receiveChannelCallback;

  localConnection.createOffer().then(gotDescription1);
}

function onCreateSessionDescriptionError(error) {}

function sendData() {
  sendChannel.send(dataChannelSend.value);
}

function closeDataChannels() {
  sendChannel.close();
  receiveChannel.close();
  localConnection.close();
  remoteConnection.close();
  localConnection = null;
  remoteConnection = null;
  startButton.disabled = false;
  sendButton.disabled = true;
  closeButton.disabled = true;
  dataChannelSend.value = "";
  dataChannelReceive.value = "";
  dataChannelSend.disabled = true;
  disableSendButton();
  enableStartButton();
}

function gotDescription1(desc) {
  localConnection.setLocalDescription(desc);
  remoteConnection.setRemoteDescription(desc);
  remoteConnection
    .createAnswer()
    .then(gotDescription2, onCreateSessionDescriptionError);
}

function gotDescription2(desc) {
  remoteConnection.setLocalDescription(desc);
  localConnection.setRemoteDescription(desc);
}

function iceCallback1(event) {
  if (event.candidate) {
    remoteConnection
      .addIceCandidate(event.candidate)
      .then(onAddIceCandidateSuccess, onAddIceCandidateError);
  }
}

function iceCallback2(event) {
  if (event.candidate) {
    localConnection
      .addIceCandidate(event.candidate)
      .then(onAddIceCandidateSuccess, onAddIceCandidateError);
  }
}

function onAddIceCandidateSuccess() {}

function onAddIceCandidateError(error) {}

function receiveChannelCallback(event) {
  receiveChannel = event.channel;
  receiveChannel.onmessage = onReceiveMessageCallback;
}

function onReceiveMessageCallback(event) {
  dataChannelReceive.value = event.data;
}

function onSendChannelStateChange() {
  var readyState = sendChannel.readyState;
  if (readyState === "open") {
    dataChannelSend.disabled = false;
    dataChannelSend.focus();
    sendButton.disabled = false;
    closeButton.disabled = false;
  } else {
    dataChannelSend.disabled = true;
    sendButton.disabled = true;
    closeButton.disabled = true;
  }
}

function onReceiveChannelStateChange() {
  var readyState = receiveChannel.readyState;

  if (text[text.length - 1] === "\n") {
    text = text.substring(0, text.length - 1);
  }
  if (window.performance) {
    var now = (window.performance.now() / 1000).toFixed(3);
    console.log(now + ": " + text);
  } else {
    console.log(text);
  }
}
