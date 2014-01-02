// prefix monkeypatching
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var _myVideoCallback=null;

function openCameraPane(callback, fullscreen) {
	if (fullscreen)
		document.body.webkitRequestFullscreen();
	_myVideoCallback = callback;
	var constraints = {video: true};

	/* Here's where you need to ask for access to the webcam.
	   Note you have constraints defined above, and callbacks
	   for success and errors defined below. */
}

function successCallback(stream) {
	var video = createVideoUserInterface();

	/* Here's where you need to associate the stream with the
	   video element just created. */
}

function errorCallback(error) {
	alert("Error getting camera access!")
}

function snapshot(ev) {
	var video = ev.target;
	var canvas = video.parentElement.canvas;
	var ctx = canvas.getContext('2d');

	// make sure the canvas matches the video dimensions and show the canvas
	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;
	swapInCanvas(video.parentElement);

	/* Now you need to draw the video image to the canvas context. */
}

function useThisImage(ev) {
	var container = ev.target.parentElement.parentElement.parentElement;
	var canvas = container.canvas;
	callback = container.callback;
	container.parentElement.removeChild(container);
	if (!callback)
		return;

	callback( 
		/* The callback takes an URL as a parameter.  
		   Create one from the canvas. */
	);
}

function retakeImage(ev) {
	var container = ev.target.parentElement.parentElement.parentElement;

	swapInVideo(container);			
}

function swapInCanvas(container) {
	container.video.style.visibility="hidden";
	container.canvasContainer.style.visibility="visible";
}

function swapInVideo(container) {
	container.canvasContainer.style.visibility="hidden";
	container.video.style.visibility="visible";
}

function createVideoUserInterface() {
	var container = document.createElement("div");
	container.callback = _myVideoCallback;
	container.style.width="100%";
	container.style.height="100%";
	container.style.position="absolute";
	container.style.left="0px";
	container.style.top="0px";
	container.style.zIndex="1000";
	var video = document.createElement("video");
	video.autoplay = true;
	video.style.width="100%";
	video.style.height="100%";
	video.style.position="absolute";
	var canvas = document.createElement("canvas");
	container.appendChild(video);
	var cc = document.createElement("div");
	var ok = document.createElement("button");
	ok.appendChild(document.createTextNode("Use This"));
	ok.onclick=useThisImage;
	var cancel = document.createElement("button");
	cancel.appendChild(document.createTextNode("Retake"));
	cancel.onclick=retakeImage;
	var buttons = document.createElement("div");

	cc.style.display="flex";
	cc.style.flexDirection="column";
	cc.style.alignItems="center";
	cc.style.visibility="hidden";
	buttons.style.display="flex";
	buttons.style.flexDirection="row";
	buttons.style.justifyContent="space-around";
	buttons.appendChild(ok);
	buttons.appendChild(cancel);
	cc.appendChild(canvas);
	cc.appendChild(buttons);
	container.appendChild(cc);
	container.canvas = canvas;
	container.video = video;
	container.canvasContainer=cc;
	document.body.appendChild(container);
	video.addEventListener('click', snapshot, false);

	return video;
}
