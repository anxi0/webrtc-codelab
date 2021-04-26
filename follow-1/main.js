"use strinct";

// 이부분은 무슨의미?
// prefixed name이라고 함
navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

var constraints = {
  audio: false,
  video: true,
};

var video = document.querySelector("video");

function successCallback(stream) {
  window.stream = stream; // console에서 stream이 가능하게
  if (window.URL) {
    video.src = window.URL.createObjectURL(stream);
  } else {
    video.src = stream;
  }
}

function errorCallback(error) {
  console.log("navigator.getUserMedia error: ", error);
}

// navigator.getUserMedia 사용법
navigator.getUserMedia(constraints, successCallback, errorCallback);
