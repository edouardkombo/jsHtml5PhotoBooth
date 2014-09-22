/***************************************************
    Detect browser
***************************************************/
if((window.chrome !== null) && (window.navigator.vendor === "Google Inc.")) {
} else { 
   alert('This application will only work on Google Chrome!');
}

var jsPhotoBooth = new jsHtml5PhotoBooth();

/***************************************************
	Init Html5 Video Streaming
***************************************************/
jsPhotoBooth.width                       = '640';
jsPhotoBooth.height                      = '480';
jsPhotoBooth.videoTagIdHost              = 'media';
jsPhotoBooth.videoTagId                  = 'pîcture';
jsPhotoBooth.canvasTagId                 = 'canvas';
jsPhotoBooth.pictureFormat               = '.jpeg';
jsPhotoBooth.pictureQuality              = '1';
jsPhotoBooth.captureFromCanvas           = false;
jsPhotoBooth.hideWebcamWhileSnapshot     = true; //Hide webcam while recording, strongly improves performance
jsPhotoBooth.mediaPath                   = '/medias/Temp/';
jsPhotoBooth.phpFile                     = '/form/Process.php'; //Create your own file or ask me for it (edouard.kombo@gmail.com)

jsPhotoBooth.init();


function startCapture() {
    jsPhotoBooth.startCapture();
    stopRecording();
}

function stopRecording() {
    jsPhotoBooth.stopCapture('downloadAndStream');
}
