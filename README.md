Js Html5 Photo Booth
====================

JsHtml5PhotoBooth is a powerful and native html5 object that helps you take webcam snapshots directly from your browser.
After your snapshot has been taken, you can:
- Add a watermark to the picture
- Rotate the picture
- Print instantly the picture without prompt, on your system default printer (windows only)

I hope this greatful plugin will help you !


1) How to install
---------------------

    bower install js-html5-photo-booth


2) How to use it?
-----------------

    //Instantiate the object
    var jsPhotoBooth = new jsHtml5PhotoBooth();

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

    //Optional
    jsPhotoBooth.flip                        = '';                          //Possible values (horizontal, vertical)

    //Start the plugin
    jsPhotoBooth.init();


    function startRecording() {
        jsPhotoBooth.startRecording();
        stopRecording();
    }

    function stopRecording() {
        //For demo
        jsPhotoBooth.stopRecording('download');

        //Use this in production
        //jsPhotoBooth.stopRecording();
    }

    //Show the converted media
    function stream() {

        var img = document.createElement('img');
        img.src = jsPhotoBooth.urlToStream;
        img.id  = 'resultPicture';

        document.getElementById('containerId').appendChild(img);                
    }
        
3) Live Demonstration
---------------------

http://edouardkombo.github.io/jsHtml5PhotoBooth/demo/
    

Contributing
-------------

If you do contribute, please make sure it conforms to the PSR coding standard. The easiest way to contribute is to work on a checkout of the repository, or your own fork, rather than an installed version.

Want to learn more? Visit my blog http://creativcoders.wordpress.com


Issues
------

Bug reports and feature requests can be submitted on the [Github issues tracker](https://github.com/edouardkombo/jsHtml5PhotoBooth/issues).

For further informations, contact me directly at edouard.kombo@gmail.com.
