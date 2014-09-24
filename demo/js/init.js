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
jsPhotoBooth.width                       = '640';               //Width of the canvas and video tag element
jsPhotoBooth.height                      = '480';               //Height of the canvas and video tag element

jsPhotoBooth.resultTagIdHost             = 'media';             //Div id where to store (the picture taken by the user)
jsPhotoBooth.resultTagId                 = 'myPicture';         //Id of the result picture to show to user inside the resultTagIdHost

jsPhotoBooth.videoTagIdHost              = 'media';             //Div id where to store (video and canvas html tag element)
jsPhotoBooth.videoTagId                  = 'video';             //Id of the video tag element
jsPhotoBooth.canvasTagId                 = 'canvas';            //Id of the canvas tag element

jsPhotoBooth.pictureExtension            = 'jpeg';             //Picture extension (jpeg, png, gif, bmp)
jsPhotoBooth.pictureQuality              = '1';                 //Picture quality (from 0.0 to 1)

jsPhotoBooth.captureFromCanvas           = false;               //If you want to apply live webcam effects or not, from another script

jsPhotoBooth.showStreamOnFinish          = true;                //Show the video stream after the picture has been taken
jsPhotoBooth.hideWebcamWhileSnapshot     = true;                //Hide webcam while snapshot, strongly improves performance

jsPhotoBooth.mediaPath                   = '/medias/Temp/';     //Path where to store te picture on the server
jsPhotoBooth.phpFile                     = '/form/pictureProcess.php'; //Php file that will proceed to picture saving on the server

/**
 * You must use "save", "saveAndDownload" or "saveAndStream" methods
 * This only works on local machines
 */
jsPhotoBooth.printPictureOnFinish        = true;                //Works only on windows system (You can update the batch file to your needs)
jsPhotoBooth.printPhpFile                = 'form/printPicture.php'; //Php file to proceed to picture printing
jsPhotoBooth.printOptionComputerName     = 'ALLINONE02';        //Computer name to target the network
jsPhotoBooth.printOptionSharedPrinterName= 'SamsungPrinter';    //Name of the shared printer inside your windows network
jsPhotoBooth.printBatchFile              = '/form/print.bat';    //Automatically generated and deleted

/**
 * Apply watermark to the picture
 */
jsPhotoBooth.watermarkImage              = '/medias/watermark.gif';  //Path where to find the watermark image

/**
 * Apply rotation to the output
 */
jsPhotoBooth.rotation                    = 0;  //Rotate the picture

jsPhotoBooth.init();


function startCapture() {
    jsPhotoBooth.startCapture();
    stopRecording();
}

function stopRecording() {
    jsPhotoBooth.stopCapture('downloadAndStream');
}
