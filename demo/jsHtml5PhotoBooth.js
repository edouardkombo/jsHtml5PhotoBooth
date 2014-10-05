/**
 * Object:  jsHtml5PhotoBooth
 * Version: master
 * Author:  Edouard Kombo
 * Twitter: @EdouardKombo
 * Github:  https://github.com/edouardkombo
 * Blog:    http://creativcoders.wordpress.com
 * Url:     https://github.com/edouardkombo/jsHtml5PhotoBooth
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
    videoTagId: 'video',
    canvasTagId: 'canvas',
    videoTag: 0,
    canvasTag: 0,
    ctx: 0,    
    width: 0,
    height: 0,
    mediaPath: '',    
    phpFile: '',    
    videoTagIdHost: '',
    pictureExtension: '',
    pictureResource: '',
    pictureQuality: '',
    hideWebcamWhileSnapshot: true,
    captureFromCanvas: false,
    printPhpFile: '',
    printOptionSharedPrinterName: '',
    watermarkImage: false,
    rotation: false,
    fileName: '',
    client: '',
    callback: '',
    callbackType: '',
    urlToStream: '',
    
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
        
        } else {

            if (tag === 'canvas') {
                this.canvasTag                  = myTag;
                this.canvasTag.id               = tagId;                
                this.canvasTag.width            = this.width;
                this.canvasTag.height           = this.height;               
            } else {
                this.videoTag                   = myTag;
                this.videoTag.setAttribute('autoplay','true');
                if (this.mediaStream !== '') {
                    this.videoTag.src = window.URL.createObjectURL(this.mediaStream);
                }                
                this.videoTag.id                = tagId;                
                this.videoTag.width             = this.width;
                this.videoTag.height            = this.height;               
            }
        }
    },                 
    
    /**
     * Set current id (timestamp)
     * 
     * @returns {undefined}
     */
    setFileName: function () {
        this.fileName = Date.now();        
    },    
    
    /**
     * Start photo capture
     * 
     * @returns {Boolean}
     */
    startRecording: function ()
    {   
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
    stopRecording: function (method)
    {
        this.setFileName();        
        
        this.save(this.pictureResource);
            
        if (method === 'download') {
            this.download(this.pictureResource);   
        }
        
        this.showHideStream('show');       
        
        return true;
    },
    
    /**
     * XmlHttpRequest main method
     * 
     * @param {String} url
     * @param {Object} datas
     * @returns {undefined}
     */
    xhr: function (url, datas) {
        
        this.client = new XMLHttpRequest();
        this.client.onreadystatechange = function() 
        {
            if ((this.client.readyState === 4) && (this.client.status === 200)) 
            {
                console.log(this.client.response);

                this.urlToStream = this.mediaPath + this.fileName + '/' + this.fileName + '.' + this.pictureExtension;
                this.callbackType = 'picture';
                var fn = window[this.callback];
                fn();
                this.showHideStream('show');                
            }
        }.bind(this);
        this.client.open("post", url);
        this.client.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        this.client.setRequestHeader("cache-Control", "no-store, no-cache, must-revalidate");
        this.client.setRequestHeader("cache-Control", "post-check=0, pre-check=0");
        this.client.setRequestHeader("cache-Control", "max-age=0");
        this.client.setRequestHeader("Pragma", "no-cache");
        this.client.send(datas);        
    },
    
    /**
     * Save picture on the disk
     * 
     * @param   {Object}    blob
     * @returns {undefined}
     */
    save: function (blob) {
        
        var formData = new FormData();
        formData.append('picture-blob', blob);        
        formData.append('extension', this.pictureExtension);
        formData.append('watermark', this.watermarkImage);
        formData.append('rotation', this.rotation);
        formData.append('path', this.mediaPath);
        formData.append('filename', this.fileName);      
        formData.append('sharedPrinterName', this.printOptionSharedPrinterName);        
                  
        this.xhr(this.phpFile, formData);                
    },
    
    /**
     * Directly download picture from browser
     * 
     * @param   {Object|String} blob
     * @returns {undefined}
     */
    download: function(blob) {
        
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
    }    
};
