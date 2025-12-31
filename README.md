# Starstream

The goal of this project is to create a single web interface that can be used to send multimedia between computers.

## starstream-server

signalling server.

- lists availible peers
- sends TURN information
- forwards connection init messages between peers

## starstream-peer

the web frontend.

- By default - connects to the same server that is hosting this app
- loads peers (and displays them) and TURN (in background) from server
- allows connection to other peers

## commands

```
npm install
npm run build
npm start
```


## Learning

1. How does simple-peer create connections?
    - gets an ID and some other parameters
    - calls the "Signal" method
    - the other side listens to the various signals and does stuff
2. How does rtc-patch-bay allow two peers to exchange information and connect them?
    - uses "socket.io-client" to send messages to the server, which then does stuff
    - keeps track of all peers data in a room
    - forwards messages to all peers
3. How does hydra turn a canvas into data over webRTC
    - the pb object is given a captureStream reference
    - a VidRecorder is given this reference also
    - video-recorder uses the MediaRecorder API from js
    - ...somehow, the MediaRecorder and the pb object know what to do with each others data? unsure where the regl canvas and the stream connect.
4. How does hydra get the webcam onto the canvas
    - window.navigator.mediaDevices.getUserMedia(constraints)
    - creates a new html element called video that is hidden
    - creates a new regl texture with a src of that video element
5. How does hydra get the screencapture onto the canvas
6. How does hydra get audio over webrtc