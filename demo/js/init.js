/***************************************************
    Detect browser
***************************************************/
if((window.chrome !== null) && (window.navigator.vendor === "Google Inc.")) {
} else { 
   alert('This application will only work on Google Chrome!');
}

var jsPhotoBooth = new jsHtml5PhotoBooth();

/***************************************************
	Init Html5 photo booth object
***************************************************/
jsPhotoBooth.width                       = '640';                       //Width of the canvas and video tag element
jsPhotoBooth.height                      = '480';                       //Height of the canvas and video tag element
jsPhotoBooth.videoTagIdHost              = 'media';                     //Div id where to store (video and canvas html tag element)
jsPhotoBooth.videoTagId                  = 'video';                     //Id of the video tag element
jsPhotoBooth.canvasTagId                 = 'canvas';                    //Id of the canvas tag element
jsPhotoBooth.pictureExtension            = 'jpeg';                      //Picture extension (jpeg, png, gif, bmp)
jsPhotoBooth.pictureQuality              = '1';                         //Picture quality (from 0.0 to 1)
jsPhotoBooth.captureFromCanvas           = false;                       //If you want to apply live webcam effects or not, from another script
jsPhotoBooth.hideWebcamWhileSnapshot     = true;                        //Hide webcam while snapshot, strongly improves performance
jsPhotoBooth.mediaPath                   = '/medias/Temp/';             //Path where to store te picture on the server
jsPhotoBooth.phpFile                     = '/form/saveAndPrint.php';    //Php file that will proceed to picture saving on the server
jsPhotoBooth.callback                    = 'stream';                    //Callback method to call when process is finished
jsPhotoBooth.printOptionSharedPrinterName= 'Deskjet';                   //Name of the shared printer inside your windows network
jsPhotoBooth.watermarkImage              = '/medias/watermark.gif';     //Path where to find the watermark image
jsPhotoBooth.rotation                    = 0;                           //Rotate the picture

jsPhotoBooth.init();


function startRecording() {
    jsPhotoBooth.startRecording();
    stopRecording();
}

/**
 * You can use "save", "saveAndDownload" or "saveAndStream", "downloadAndStream" parameters
 */
function stopRecording() {
    //For demo
    jsPhotoBooth.stopRecording();

    //Use this in production
    //jsPhotoBooth.stopCapture('download');
}

//Show the converted media
function stream() {
    
    var img = document.createElement('img');
    img.src = jsPhotoBooth.urlToStream;
    img.id  = 'resultPicture';

    document.getElementById('containerId').appendChild(img);                
}