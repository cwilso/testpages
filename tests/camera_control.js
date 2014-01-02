// prefix monkeypatching
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var _myVideoCallback=null;

function openCameraPane(callback, fullscreen) {
	if (fullscreen)
		document.body.webkitRequestFullscreen();
	_myVideoCallback = callback;
	var constraints = {video: true};

	navigator.getUserMedia(constraints, successCallback, errorCallback);
}

function successCallback(stream) {
	var video = createVideoUserInterface();

	video.src = window.URL.createObjectURL(stream);
}

function errorCallback(error) {
	alert("Error getting camera access!")
}

function snapshot(ev) {
	var video = ev.target;
	var canvas = video.parentElement.canvas;

	// make sure the canvas matches the video dimensions
	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;

	// show the canvas, not the video
	swapInCanvas(video.parentElement);

	// now grab the video image and draw it to the canvas
	var ctx = canvas.getContext('2d');
	ctx.drawImage(video, 0, 0);
}

function useThisImage(ev) {
	var container = ev.target.parentElement.parentElement.parentElement;
	var canvas = container.canvas;
	callback = container.callback;
	container.parentElement.removeChild(container);
	if (!callback)
		return;

	callback( canvas.toDataURL('image/png') );
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
