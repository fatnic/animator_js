// Requires: assetmanager.js

function TMXLoader(am, json) {
    this.am = am;
    this.json = am.get('json.' + json);
    this.img = new Image();
    this.layers = [];
    this.tilelayers = [];
    this.objectlayers = [];
    this.rendered = null;
    this.init();
}

TMXLoader.prototype = {

    init: function() {
        this.canvas = new Vec2(this.json.tilewidth * this.json.width, this.json.tileheight * this.json.height);
        this.tile = new Vec2(this.json.tilewidth, this.json.tileheight);
        this.grid = new Vec2(this.json.width, this.json.height);
        this.tilelayers = this.getLayersByType('tilelayer').map(function(layer) { return layer.name; });
        this.objectlayers = this.getLayersByType('objectgroup').map(function(layer) { return layer.name; });
    },

    autoRender: function() {
        for(var i=0; i < this.tilelayers.length; i++) {
            if (this.getLayerByName(this.tilelayers[i]).visible === false) continue;
            this.renderLayer(this.tilelayers[i]);
        }
    },

    getLayersByType: function(type) {
        return this.json.layers.filter(function(layer){ return layer.type == type; });
    },

    getObjectsFromLayer: function(name) {
        var layer = this.getLayerByName(name);
        return layer.objects;
    },

    getLayerByName: function(name) {
        return this.json.layers.filter(function(layer){ return layer.name == name; })[0];
    },

    drawLayer: function(name, context) {
        var layer = this.getLayerByName(name);
        var imgname = this.json.tilesets[0].image.split('.')[0];
        var tilesetWidth = this.json.tilesets[0].imagewidth;
        var that = this;
        var sourceX, sourceY;
        var tileimg = this.am.get('img.' + imgname);
        for (var i=0; i < layer.data.length; i++) {
            if (layer.data[i] === 0) continue;
            sourceX = ((layer.data[i] - 1) * this.tile.x) % tilesetWidth;
            sourceY = Math.floor(((layer.data[i] - 1) * this.tile.x) / tilesetWidth) * this.tile.x;

            targetX = (i % this.grid.x) * this.tile.x;
            targetY = Math.floor((i / this.grid.x)) * this.tile.x;

            context.drawImage(tileimg, sourceX, sourceY, this.tile.x, this.tile.y, targetX, targetY, this.tile.x, this.tile.y);
        }
    },

    renderLayer: function(name) {
        var cvs = document.createElement('canvas');
        cvs.width = this.canvas.x;
        cvs.height = this.canvas.y;
        var contx = cvs.getContext('2d');
        this.drawLayer(name, contx);
        this.layers.push(cvs);
        this.renderLayers();
    },

    renderLayers: function() {
        var cvs = document.createElement('canvas');
        cvs.width = this.canvas.x;
        cvs.height = this.canvas.y;
        var contx = cvs.getContext('2d');
        for(var i=0; i < this.layers.length; i++) { contx.drawImage(this.layers[i], 0, 0); }
        this.rendered = contx.getImageData(0, 0, cvs.width, cvs.height);
    },

    draw: function(context) {
        if (this.rendered === null) this.autoRender();
        context.putImageData(this.rendered, 0, 0);
    },

    render: function(context) {
        for(var i=0; i < this.tilelayers.length; i++) { this.drawLayer(this.tilelayers[i], context); }
    },

};
