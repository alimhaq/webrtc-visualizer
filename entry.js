// Get the modal
var modal = document.getElementById('myModal');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
window.onload = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// define variables in highest level of scope so variables are accessible to all functions

let stream;
let bars = 200;
let react_x = 0;
let react_y = 0;
let center_x;
let center_y;
let radius = 0;
let radius_old;
let deltarad = 0;
let shockwave = 0;
let rot = 0;
let intensity = 0;
let rads;
let bar_x;
let bar_y;
let bar_x_term;
let bar_y_term;
let bar_width;
let bar_height;
let canvas = document.getElementById("visualizer");
let ctx = canvas.getContext("2d");
let analyser;
let fbc_array;

// Generate random room name as hash from URL to be shared with a peer;
// if there is already a location.hash, then that means the second peer
// is connecting to the visualizer
if (!location.hash) {
  location.hash = Math.floor(Math.random() * 0xFFFFFF).toString(16);
}
const roomHash = location.hash.substring(1);

// Create ScaleDrone object to handle signalling aspect of WebRTC
const drone = new ScaleDrone('rvrxRvWFRD1CikaM');
// Room name needs to be prefixed with 'observable-'
const roomName = 'observable-' + roomHash;

// Utilize Google stun server to bypass firewall(?)
const configuration = {
  iceServers: [{
    url: 'stun:stun.l.google.com:19302'
  }]
};

let room;
let pc;

// Open a room in the Scaledrone server that takes as argument the roomName
// This essentially sets up the signalling aspect by allowing two peers to
// find each other through a common roomName in the Scaledrone server
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
  // We're connected to the room and received an array of 'members'
  // that are connected to the room (including us): the Signaling server is now ready.
  room.on('members', members => {
    console.log('MEMBERS', members);
    // If we are the second user to connect to the room we will be creating the offer
    const isOfferer = members.length === 2;
    startWebRTC(isOfferer);
  });
});

// Send signaling data via Scaledrone
function sendMessage(message) {
  drone.publish({
    room: roomName,
    message
  });
}

function startWebRTC(isOfferer) {
  pc = new RTCPeerConnection(configuration);

  // 'onicecandidate' notifies us whenever an ICE agent needs to deliver a
  // message to the other peer through the signaling server
  pc.onicecandidate = event => {
    if (event.candidate) {
      sendMessage({'candidate': event.candidate});
    }
  };

  // If user is offerer let the 'negotiationneeded' event create the offer
  if (isOfferer) {
    pc.onnegotiationneeded = () => {
      pc.createOffer(localDescCreated, error => console.error(error));
    }
  }

  // When a remote stream arrives display it in the #remoteAudio element
  pc.onaddstream = event => {
    remoteAudio.srcObject = event.stream;
    stream2 = event.stream;
    runVisualizer();
  };

  // undepreciated way to get the video/audio feed from user and send it to localAudio element in HTML

  const constraints = {
    audio: true,
    video: false
  }
  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
    localAudio.srcObject = stream;
    // console.log(stream.getAudioTracks());
    stream1 = stream;
    // console.log(stream1);
    // runVisualizer();
    pc.addStream(stream);
  }).catch(error => console.error(error));

  // navigator.getUserMedia({
  //   audio: true,
  //   video: false,
  // }, stream => {
  //   // Display your local video in #localVideo element
  //   localAudio.src = URL.createObjectURL(stream);
  //   // Add your stream to be sent to the conneting peer
  //   pc.addStream(stream);
  // }, error => console.error(error));

  // Listen to signaling data from Scaledrone
  room.on('data', (message, client) => {
    console.log('CLIENT', client);
    // Message was sent by us
    if (client.id === drone.clientId) {
      return;
    }
    if (message.sdp) {
      // This is called after receiving an offer or answer from another peer
      pc.setRemoteDescription(new RTCSessionDescription(message.sdp), () => {
        // When receiving an offer lets answer it
        if (pc.remoteDescription.type === 'offer') {
          pc.createAnswer(localDescCreated, error => console.error(error));
        }
      }, error => console.error(error));
    } else if (message.candidate) {
      // Add the new ICE candidate to our connections remote description  
      pc.addIceCandidate(new RTCIceCandidate(message.candidate));
    }
  });
}

function localDescCreated(desc) {
  pc.setLocalDescription(
    desc,
    () => sendMessage({'sdp': pc.localDescription}),
    error => console.error(error)
  );
}

function runVisualizer() {
	var elem = document.getElementById('instruct');
  elem.parentNode.removeChild(elem);
  var audioCtx = new AudioContext();
  analyser = audioCtx.createAnalyser();
  console.log(stream1);
  console.log(stream2);
  var source1 = audioCtx.createMediaStreamSource(stream1);
  var source2 = audioCtx.createMediaStreamSource(stream2);
  var merger = audioCtx.createChannelMerger(2);
  source1.connect(merger);
  source2.connect(merger);
	merger.connect(analyser);
	// analyser.connect(audioCtx.destination);
	
	fbc_array = new Uint8Array(analyser.frequencyBinCount);
	
	frameLooper();
}

function resize_canvas() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
  }

function frameLooper() {
	resize_canvas();
				
	var grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
	grd.addColorStop(0, "rgba(29, 67, 80, 1)");
	grd.addColorStop(1, "rgba(164, 57, 49, 1)");

	ctx.fillStyle = grd;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	ctx.fillStyle = "rgba(255, 255, 255, " + (intensity * 0.0000125 - 0.4) + ")";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
		
	rot = rot + intensity * 0.0000001;
		
	react_x = 0;
	react_y = 0;
				
	intensity = 0;
				
	analyser.getByteFrequencyData(fbc_array);
	
	for (var i = 0; i < bars; i++) {
		rads = Math.PI * 2 / bars;
						
		bar_x = center_x;
		bar_y = center_y;
				
		bar_height = Math.min(99999, Math.max((fbc_array[i] * 2.5 - 200), 0));
		bar_width = bar_height * 0.02;
						
		bar_x_term = center_x + Math.cos(rads * i + rot) * (radius + bar_height);
		bar_y_term = center_y + Math.sin(rads * i + rot) * (radius + bar_height);
						
		ctx.save();
					
		var lineColor = "rgb(" + (fbc_array[i]).toString() + ", " + 255 + ", " + 255 + ")";
						
		ctx.strokeStyle = lineColor;
		ctx.lineWidth = bar_width;
		ctx.beginPath();
		ctx.moveTo(bar_x, bar_y);
		ctx.lineTo(bar_x_term, bar_y_term);
		ctx.stroke();
					
		react_x += Math.cos(rads * i + rot) * (radius + bar_height);
		react_y += Math.sin(rads * i + rot) * (radius + bar_height);
					
		intensity += bar_height;
	}
				
	center_x = canvas.width / 2 - (react_x * 0.007);
	center_y = canvas.height / 2 - (react_y * 0.007);
				
	radius_old = radius;
	radius =  25 + (intensity * 0.002);
	deltarad = radius - radius_old;
				
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.beginPath();
	ctx.arc(center_x, center_y, radius + 2, 0, Math.PI * 2, false);
	ctx.fill();
	
	// shockwave effect			
	shockwave += 60;
				
	ctx.lineWidth = 15;
	ctx.strokeStyle = "rgb(255, 255, 255)";
	ctx.beginPath();
	ctx.arc(center_x, center_y, shockwave + radius, 0, Math.PI * 2, false);
	ctx.stroke();
				
				
	if (deltarad > 15) {
		shockwave = 0;
		
		ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		rot = rot + 0.4;
	}
	
	window.requestAnimationFrame(frameLooper);
}

