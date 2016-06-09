var Wall = function(x,y,w,h,render){
    this.position = new Vec2(x, y);
    this.size = new Vec2(w, h);
    this.render = (render !== null) ? render : true;

    this.segments = [];

    this.segments.push({a:{x:x,y:y}, b:{x:x+w,y:y}});
    this.segments.push({a:{x:x+w,y:y}, b:{x:x+w,y:y+h}});
    this.segments.push({a:{x:x+w,y:y+h}, b:{x:x,y:y+h}});
    this.segments.push({a:{x:x,y:y+h}, b:{x:x,y:y}});
};

Wall.prototype = {
    draw: function(context) {
        context.fillStyle = "rgb(0,0,255)";
        if (this.render) context.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
    },

    debugDraw: function(context) {
        context.beginPath();
        context.strokeStyle = 'rgb(255,255,0)';
        context.strokeWidth = 3;
        context.rect(this.position.x,  this.position.y, this.size.x, this.size.y);
        context.stroke();
    },
};

function wallByGrid(x,y,w,h,grid,render) {
    Walls.push(new Wall(x*grid, y*grid, w*grid, h*grid,render));
}

function allWallSegments(){
    var wallSegments = [];
    Walls.forEach(function(wall){ wallSegments = wallSegments.concat(wall.segments); });
    return wallSegments;
}
