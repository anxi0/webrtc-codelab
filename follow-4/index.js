"use strict";

var os = require("os");
var nodeStatic = require("node-static");
var http = require("http");
var socketIO = require("socket.io");

var fileServer = new nodeStatic.Server();
var app = http
  .createServer((req, res) => {
    fileServer.serve(req, res);
  })
  .listen(7777);

var io = socketIO.listen(app);
io.sockets.on('connection',(socket)=>{
    function log()
})
