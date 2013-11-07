		var localMediaStream = null;
		// prefix monkeypatching
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

		function openCameraPane(cb, fullscreen) {
			if (fullscreen)
				document.body.webkitRequestFullscreen();
			var constraints = {video: true};
			navigator.getUserMedia(constraints, successCallback.bind(cb), errorCallback);
		}

		function useThis(ev) {
			var container = ev.target.parentElement.parentElement.parentElement;

			container.parentElement.removeChild(container);
			if (container.callback)
				container.callback( container.canvas.toDataURL('image/png') );
		}
		function retake(ev) {
			var container = ev.target.parentElement.parentElement.parentElement;

			swapInVideo(container);			
		}
		function createVideoFrame(callback) {
			var container = document.createElement("div");
			container.callback = callback;
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
			ok.onclick=useThis;
			var cancel = document.createElement("button");
			cancel.appendChild(document.createTextNode("Retake"));
			cancel.onclick=retake;
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

			return video;
		}
		function successCallback(stream) {  /*"this" is the callback*/
			var video = createVideoFrame(this);
			video.addEventListener('click', snapshot, false);
			video.src = window.URL.createObjectURL(stream);
			localMediaStream = stream;
		}

		function errorCallback(error) {
		  console.log("navigator.getUserMedia error: ", error);
		  alert("Error getting camera access!")
		}

		function swapInCanvas(container) {
			container.video.style.visibility="hidden";
			container.canvasContainer.style.visibility="visible";
		}

		function swapInVideo(container) {
			container.canvasContainer.style.visibility="hidden";
			container.video.style.visibility="visible";
		}

		function snapshot(ev) {
			var video = ev.target;
			var canvas = video.parentElement.canvas;

			// make sure the canvas matches the video dimensions
			canvas.width = video.videoWidth;
		    canvas.height = video.videoHeight;

		    // now grab the video image and draw it to the canvas
			var ctx = canvas.getContext('2d');
		    ctx.drawImage(video, 0, 0);

			swapInCanvas(video.parentElement);
		}
