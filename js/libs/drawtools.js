var DrawTools = {

    line: function(context, start, end, colour, thickness) {
        context.strokeStyle = (typeof(colour) === 'undefined') ? 'white' : thickness;
        context.lineWidth = (typeof(thickness) === 'undefined') ? 1 : thickness;
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.stroke();
    },

    fillRect: function(context, position, size, colour) {
        context.fillStyle = (typeof(colour) === 'undefined') ? 'white' : colour;
        context.fillRect(position.x, position.y, size.x, size.y);
    },

    circle: function(context, position, radius, colour) {
        context.fillStyle = colour;
        context.beginPath();
    	context.arc(position.x, position.y, radius, 0, RAD, false);
        context.fill();
    },

    ring: function(context, position, radius, colour, thickness) {
        context.strokeStyle = colour;
        context.lineWidth = (typeof(thickness) === 'undefined') ? 1 : thickness;
        context.beginPath();
    	context.arc(position.x, position.y, radius, 0, RAD, false);
        context.stroke();
    },

    ringedCircle: function(context, position, radius, circleColour, ringColour, thickness) {
        this.circle(context, position, radius, circleColour);
        this.ring(context, position, radius, ringColour, thickness);
    },

    polygon: function(context, polygon, colour) {
        context.fillStyle = colour;
        context.beginPath();
        context.moveTo(polygon[0].x, polygon[0].y);
        for (var i = 1; i < polygon.length; i++) {
            context.lineTo(polygon[i].x, polygon[i].y);
        }
        context.fill();
    },

    polyOutline: function(context, polygon, width, colour) {
        context.strokeStyle = colour;
        context.lineWidth = width;
        context.beginPath();
        context.moveTo(polygon[0].x, polygon[0].y);
        for (var i = 1; i < polygon.length; i++) { context.lineTo(polygon[i].x, polygon[i].y); }
        context.lineTo(polygon[0].x, polygon[0].y);
        context.stroke();
    },

    clear: function(context, colour) {
        context.fillStyle = colour || 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
};
