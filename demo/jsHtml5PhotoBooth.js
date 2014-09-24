/**
 * Object:  jsHtml5PhotoBooth
 * Version: master
 * Author:  Edouard Kombo
 * Twitter: @EdouardKombo
 * Github:  https://github.com/edouardkombo
 * Blog:    http://creativcoders.wordpress.com
 * Url:     https://github.com/edouardkombo/jsHtml5VideoRecorder
 * 
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * 
 * Take snapshots from webcam stream in html5 with many features. Apply watermark, rotation and directly print the picture (local environments only)
 */

var jsHtml5PhotoBooth = function(){};

jsHtml5PhotoBooth.prototype = {
    url: 0,
    hasStopped: false,    
    mediaStream: '',
    resultTagId: 'myPicture',
    videoTagId: 'video',
    canvasTagId: 'canvas',
    videoTag: 0,
    canvasTag: 0,
    ctx: 0,    
    width: 0,
    height: 0,
    mediaPath: '',    
    phpFile: '',
    resultTagIdHost: '',    
    videoTagIdHost: '',
    pictureExtension: '',
    pictureResource: '',
    pictureQuality: '',
    showStreamOnFinish: true,
    hideWebcamWhileSnapshot: true,
    captureFromCanvas: false,
    printPictureOnFinish: false,
    printPhpFile: '',
    printOptionComputerName: '',
    printOptionSharedPrinterName: '',
    watermarkImage: false,
    rotation: false,
    printBatchFile: '',
    
    /**
     * Get Proper html5 getUsermedia from window.navigator object, depending on the browser
     * 
     * @returns {undefined}
     */
    init: function (){
        if (!navigator.getUserMedia) {
            navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        }
        window.URL  = window.URL || window.webkitURL;
        this.url    = window.URL;        
        
        window.onload = this.onLoad();
    },

    /**
     * Instantiate navigator.getUserMedia Api and load video stream
     * 
     * @returns {undefined}
     */
    onLoad: function () {
        navigator.getUserMedia({ 
            video: true
        }, this.startUserMedia.bind(this), function(e) {
            console.log('No live video stream: ' + e);
            alert("Webcam not enabled or no live video stream");
        });        
    },    
    
    /**
     * Create live video stream, and create html video and canvas tags if not exists
     * 
     * @param {Object} stream
     * @returns {undefined}
     */    
    startUserMedia: function (stream)
    {   
        this.mediaStream = stream;
        
        this.resetTags();
       
    },
    
    /**
     * Common method
     */
    resetTags: function()
    {
        //Create video and canvas tag if not exists
        this.createTag('video', this.videoTagId);
        this.createTag('canvas', this.canvasTagId);         
    },
    
    /**
     * Create html tag inside html document (video, canvas)
     * 
     * @param {String} tag
     * @param {String} tagId
     * @returns {jsHtml5Webcam.prototype@pro;videoTagmyTag|jsHtml5Webcam.prototype.createTag.myTag|jsHtml5Webcam.prototype.createTag.thisTag|Element}
     */
    createTag: function(tag, tagId) 
    {
        var myTag   = document.getElementById(tagId);
       
        if (myTag === null) {
            
            myTag = document.createElement(tag);
            
            if (tag === 'canvas') {
                myTag.width             = this.width;
                myTag.height            = this.height;
                myTag.id                = tagId;
                myTag.style.position    = 'absolute';
                myTag.style.visibility  = 'hidden';
                this.ctx                = myTag.getContext('2d');
                this.canvasTag          = this.ctx.canvas;
            
            } else if (tag === 'video') {    
                myTag.setAttribute('autoplay','true');
                myTag.width             = this.width;
                myTag.height            = this.height;
                myTag.id                = tagId;
                if (this.mediaStream !== '') {
                    myTag.src = window.URL.createObjectURL(this.mediaStream);
                }
                this.videoTag   = myTag;
            }
            
            document.getElementById(this.videoTagIdHost).appendChild(myTag);    
        }
    },                 
    
    /**
     * Start photo capture
     * 
     * @returns {Boolean}
     */
    startCapture: function ()
    {
        //Remove result tag and recreate it to empty cache
        var pictureResultElement = document.getElementById(this.resultTagId);   
        if (pictureResultElement) {
            pictureResultElement.remove();
        }
        
        if (this.hideWebcamWhileSnapshot) {
            //Hide video stream while recording for performance
            this.showHideStream('hide');
        }

        this.hasStopped = false;

        //If we capture from canvas for live effects on webcam, we don't have to draw the image here
        if (false === this.captureFromCanvas) {
            this.ctx.drawImage(this.videoTag, 0, 0, this.videoTag.width, this.videoTag.height);
        }

        var dataUrl             = this.canvasTag.toDataURL("image/" + this.pictureExtension, this.pictureQuality);
        this.pictureResource    = dataUrl;         

        return true;        
    },
    
    /**
     * Show or hide video stream on demand
     * 
     * @param {String} status
     * @returns {undefined}
     */
    showHideStream: function(status)
    {
        if (status === 'show') {
            this.videoTag.style.visibility  = 'visible';
            this.videoTag.style.display     = 'block';            
        } else if (status === 'hide') {
            this.videoTag.style.visibility  = 'hidden';
            this.videoTag.style.display     = 'none';           
        }
    },
    
    /**
     * Save picture
     * 
     * @param {String} method
     * @returns {Boolean}
     */
    stopCapture: function (method)
    {
        if (method === 'save') {
            this.save(this.pictureResource, false);
            
        } else if (method === 'download') {
            this.download(this.pictureResource, false);
            
        } else if (method === 'stream') {
            this.stream(this.pictureResource);

        } else if (method === 'saveAndDownload') {
            this.save(this.pictureResource, false);
            this.download(this.pictureResource, false);
                      
        } else if (method === 'saveAndStream') {
            this.save(this.pictureResource, true);
            
        } else if (method === 'downloadAndStream') {
            this.download(this.pictureResource, true);
            
        } else {
            this.save(this.pictureResource, false);
        }
        
        if (this.showStreamOnFinish) {
            this.showHideStream('show');
        }       
        
        return true;
    },
       
    /**
     * Save picture on server and stream it or not
     * 
     * @param   {Object}    blob
     * @param   {Boolean}   stream
     * @returns {undefined}
     */
    save: function (blob, stream) {
         
        var datas   = 'path='+this.mediaPath+'&type=picture&extension='+this.pictureExtension+'&watermark='+this.watermarkImage+'&rotation='+this.rotation;                  

        //Because with classic ajax requests we are unable to send huge files
        //We use original XMLHttpRequest object
        var client = new XMLHttpRequest();
        client.onreadystatechange = function() 
        {
            if (client.readyState === 4 && client.status === 200) 
            {
                console.log(client.response);

                //Get picture url with timestamp as parameter to avoid image caching
                //We only get transformed picture if updates have been applied
                var url = (this.rotation || this.watermarkImage) ? client.response + '?time=' + Date.now() : this.pictureResource;        
                
                //Print picture if allowed
                if (this.printPictureOnFinish) {
                    this.printPicture(client.response);
                }
                
                if (stream) {
                    this.stream(url);
                }                
            }
        }.bind(this);
        client.open("post", this.phpFile+'?'+datas, true);
        client.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        client.setRequestHeader("cache-Control", "no-store, no-cache, must-revalidate");
        client.setRequestHeader("cache-Control", "post-check=0, pre-check=0");
        client.setRequestHeader("cache-Control", "max-age=0");
        client.setRequestHeader("Pragma", "no-cache");            
        client.setRequestHeader("X-File-Name", encodeURIComponent('1'));
        client.setRequestHeader("Content-Type", "application/octet-stream");
        client.send(blob);                
    },
    
    /**
     * Method to print directly picture from php
     * 
     * @param {String} url
     * @returns {undefined}
     */
    printPicture: function (url) 
    {
        var formatedUrl = url.replace(this.mediaPath, '');
        
        var datas   = 'printBatch='+this.printBatchFile+'&mediaPath='+this.mediaPath+'&pictureName='+formatedUrl+'&computerName='+this.printOptionComputerName+'&sharedPrinterName='+this.printOptionSharedPrinterName;                  

        var client = new XMLHttpRequest();
        client.onreadystatechange = function() 
        {
            if (client.readyState === 4 && client.status === 200) 
            {
                console.log(client.response);               
            }
        }.bind(this);
        client.open("post", this.printPhpFile+'?'+datas, true);
        client.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        client.setRequestHeader("cache-Control", "no-store, no-cache, must-revalidate");
        client.setRequestHeader("cache-Control", "post-check=0, pre-check=0");
        client.setRequestHeader("cache-Control", "max-age=0");
        client.setRequestHeader("Pragma", "no-cache");            
        client.setRequestHeader("X-File-Name", encodeURIComponent('1'));
        client.setRequestHeader("Content-Type", "application/octet-stream");
        client.send();        
    },
    
    /**
     * Directly download picture from browser and stream it or not
     * 
     * @param   {Object|String} blob
     * @paam    {Boolean}       stream
     * @returns {undefined}
     */
    download: function(blob, stream) {
        
        //Create a link
        var hf              = document.createElement('a');

        var temporaryId     = new Date().toISOString();
        
        //Define link attributes
        hf.href             = blob;
        hf.id               = temporaryId;
        hf.download         = temporaryId + '.' + this.pictureExtension;
        hf.innerHTML        = hf.download;
        hf.style.display    = 'none';
        hf.style.visibility = 'hidden';
        //Append the link inside html code
        document.body.appendChild(hf);

        //Simulate click on link to download file, and instantly delete link
        document.getElementById(hf.id).click();
        document.getElementById(hf.id).remove();
        
        if (stream) {
            this.stream(blob);
        }        
    },
    
    /**
     * Stream
     * 
     * @param {Object|String} url (blob or string)
     * @returns {undefined}
     */
    stream: function(url) {
        
        var img = document.createElement('img');
        img.src = url;
        img.id  = this.resultTagId;
        
        document.getElementById(this.resultTagIdHost).appendChild(img);
    }    
};
