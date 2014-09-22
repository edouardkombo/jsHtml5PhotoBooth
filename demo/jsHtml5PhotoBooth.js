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
 * Take snapshots from webcam stream or canvas in html5
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
    pictureFormat: '',
    pictureResource: '',
    pictureQuality: '',
    hideWebcamWhileSnapshot: true,
    captureFromCanvas: false,
    
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
        var myTag   = document.getElementById(tag);
        
        if (myTag === null) {
            
            myTag = document.createElement(tag);
            
            if (tag === 'canvas') {
                this.ctx                = myTag.getContext('2d');
                myTag.width             = this.width;
                myTag.height            = this.height;
                myTag.style.position    = 'absolute';
                myTag.style.visibility  = 'hidden';
                myTag.id                = tagId;
                this.canvasTag          = myTag;
            
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
            
            myTag.id = tagId;
            
            if (tag === 'video') {
                this.videoTag = myTag;
                this.videoTag.setAttribute('autoplay','true');
                this.videoTag.width   = this.width;
                this.videoTag.height  = this.height;
                if (this.mediaStream !== '') {
                    this.videoTag.src = window.URL.createObjectURL(this.mediaStream);
                }            
                return this.videoTag;

            } else if (tag === 'canvas') {
                this.ctx       = myTag.getContext('2d');            
                this.canvasTag = myTag;
                this.canvasTag.width   = this.width;
                this.canvasTag.height  = this.height;            
                this.canvasTag.style.position   = 'absolute'; 
                return this.canvasTag;            
            }
        }
    },                 
    
    /**
     * Start photo capture
     * 
     * @returns {Boolean}
     */
    startCapture: function ()
    {
        //Remove video tag and recreate it to empty cache
        var videoElement = document.getElementById(this.videoTagId);   
        if (videoElement) {
            videoElement.remove();
        }
        
        this.resetTags();
        
        if (this.hideWebcamWhileSnapshot) {
            //Hide video stream while recording for performance
            this.videoTag.style.visibility  = 'hidden';
            this.videoTag.style.display     = 'none';
        }

        this.hasStopped = false;

        var extensionWithoutDot    = this.pictureFormat.replace('.', '');

        //If we capture from canvas, we can apply live effects in real time
        //If no live effects, we can directly capture from video stream
        if (false === this.captureFromCanvas) {
            this.ctx.drawImage(this.videoTag, 0, 0, this.videoTag.width, this.videoTag.height);
        }

        var dataUrl             = this.canvasTag.toDataURL("image/" + extensionWithoutDot, this.pictureQuality);
        this.pictureResource    = dataUrl;         

        return true;        
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
            this.downmload(this.pictureResource, false);
        } else if (method === 'stream') {
            this.stream(this.pictureResource);
        } else if (method === 'saveAndStream') {
            this.save(this.pictureResource, true);
        } else if (method === 'downloadAndStream') {
            this.download(this.pictureResource, true);
        } else {
            this.save(this.pictureResource, false);
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
         
        var datas   = 'path='+this.mediaPath+'&type=picture&format='+this.pictureFormat;                  

       //Because with classic ajax requests we are unable to send huge files
       //We use original XMLHttpRequest object
       var client = new XMLHttpRequest();
       client.onreadystatechange = function() 
       {
           if (client.readyState === 4 && client.status === 200) 
           {
                console.log(client.response);       

                this.callbackDatas = client.response;
                this.callbackType = 'picture';
                var fn = window[this.callback];
                fn();                   
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
     * Directly download picture from browser and stream it or not
     * 
     * @param   {Object}    blob
     * @paam    {Boolean}   stream
     * @returns {undefined}
     */
    download: function(blob, stream) {
        
        //Create a link
        var hf              = document.createElement('a');

        var temporaryId     = new Date().toISOString();
        
        //Define link attributes
        hf.href             = this.pictureResource;
        hf.id               = temporaryId;
        hf.download         = temporaryId + this.pictureFormat;
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
     * @param {Object} blob
     * @returns {undefined}
     */
    stream: function(blob) {
        
        var img = document.createElement('img');
        img.src = this.pictureResource;
        img.id  = this.videoTagId;
        
        document.getElementById(this.videoTagIdHost).appendChild(img);
    }    
};
