# WebRTC Visualizer

[WebRTC Visualizer live][webRTCvisualizer]

WebRTC visualizer is a completely front-end application designed using vanilla JavaScript that converts the audio from two connected peers to visual outputs, allowing for a stylized visualized interplay between them, and as such providing a more interactive experience for WebRTC voice communication. While the application itself is completely frontend, it does involve the use of a signalling server (provided by ScaleDrone) and a TURN server (provided by Google).

The motivation behind using WebRTC is because of it's growing use in industry; popular apps such as Google Hangouts, Facebook Messenger, Snapchat, etc. all make use of WebRTC. With the recent addition of WebRTC in Safari 11.0, it seemed a desirable technology to become familiar with.

Please see the [docs][docs] folder for design documentation.

## Features & Implementation

### WebRTC p2p Voice Chat

The main meat of the application involves the use of WebRTC to initiate a p2p voice chat. This required much research into how WebRTC works–the original goal was to utilize a library such as `SimplePeer` that made WebRTC connections easy, but it seemed like it was causing more issues than it solved due to its inflexibility. Thus, vanilla WebRTC was used along with a signalling server and TURN server. A signalling server is required in order to get the two peers to find each other; a TURN server is necessary to bypass firewall and other restrictions that prevent two peers from being connected directly through WebRTC.

The following code snippet showcases opening a room in the Scaledrone server that takes as argument the roomName, essentially setting up the signalling aspect by allowing two peers to find each other through a common roomName in the Scaledrone server

```javascript
drone.on('open', error => {
  if (error) {
    return console.error(error);
  }
  room = drone.subscribe(roomName);
  room.on('open', error => {
    console.log('Open');
    if (error) {
      console.error(error);
    }
  });
```

### Audio to Visual Conversion using Canvas

Converting the audio from the WebRTC stream to a visual output proved to be a bit of a task as well; in order to do this in JS, one needs to create an AudioContext object and then create an analyser object as well as a source object from that. This proved problematic because creating a mediaStreamSource object ended up triggering a function in the code earlier, which caused the app to mistakenly think the second peer connecting was the visual output. This bug is still in the process of being resolved.

```javascript
function runVisualizer() {
  var audioCtx = new AudioContext();
  analyser = audioCtx.createAnalyser();
  var source = audioCtx.createMediaStreamSource(stream1);
	source.connect(analyser);
	analyser.connect(audioCtx.destination);
	fbc_array = new Uint8Array(analyser.frequencyBinCount);
	frameLooper();
}
```

## Future Directions

### Additional Settings
Settings to change the visuals displayed to the user. Additionally, another set of settings could be added to change the voice that was sent to each peer, and as a result, modify the visuals as well.

### Tutorial/Demo Page
Because the app requires two different computers to really utilize it, it might be helpful to have a demo page upfront with a video to remedy this problem. Another alternative is to mention that one could use the demo by opening up the app in two separate web pages, but the effect is more interesting if two different peers are connected.

[webRTCvisualizer]: https://alimhaq.github.io/webrtc-visualizer
[docs]: ./docs