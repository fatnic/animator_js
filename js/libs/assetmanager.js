/*
    Usage:

    var assets = {
        base: '../assets',
        paths: ['sprite.png', 'loader.json']
    };

    var AM = new AssetManager(assets);
    AM.downloadAll(callback_when_done);
    AM.get('img.sprite');
    AM.get('json.loader');
*/

function AssetManager(config){
    this.successCount = 0;
    this.errorCount = 0;
    this.downloadQueue = [];
    this.cache = {};
    this.base = config.base;
    this.config = config;
    this.init();
}

AssetManager.prototype = {

    init: function() {
        for (var i=0; i < this.config.paths.length; i++) {
            this.queueDownload(this.config.paths[i]);
        }
    },

    queueDownload: function(path) { this.downloadQueue.push(this.base + path); },

    downloadAll: function(callback) {

        if (this.downloadQueue.length === 0) callback();

        for (var i=0; i<this.downloadQueue.length;i++) {
            var path = this.downloadQueue[i];
            var ext = path.split('.').pop();

            switch (ext) {
                case 'png':
                case 'jpg':
                case 'jpeg':
                    this.loadImage(path, callback);
                    break;
                case 'json':
                    this.loadJSON(path, callback);
                    break;
                default:
                    console.log('AssetManager: unknown filetype');
                    break;
            }
        }
    },

    isDone: function() { return (this.downloadQueue.length == this.successCount + this.errorCount); },

    get: function(key) { return this.cache[key]; },

    loadImage: function(path, callback) {
        var img = new Image();
        var that = this;
        img.addEventListener("load", function(){
            that.successCount += 1;
            if(that.isDone()) { callback(); }
        }, false);
        img.addEventListener("error", function(){
            that.errorCount += 1;
            if(that.isDone()) { callback(); }
        }, false);
        img.src = path;
        this.cache["img." + this.makeKey(path)] = img;
    },

    loadJSON: function(path, callback) {
        var that = this;
        var xhr = new XMLHttpRequest();
        xhr.overrideMimeType('application/json');
        xhr.open('GET', path, true);
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == "200"){
                that.cache["json." + that.makeKey(path)] = JSON.parse(xhr.responseText);
                that.successCount += 1;
                if(that.isDone()) { callback(); }
            }
        };
        xhr.send(null);
    },

    makeKey: function(path) { return path.split('/').pop().split('.')[0]; }

};
