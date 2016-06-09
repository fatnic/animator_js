// Requires: vec2.js, tools.js

var Ray = function(a,b) {
    this.a = a || new Vec2();
    this.b = b || new Vec2();
};

function Vision(fov) {
    this.fov = (typeof(fov) === 'undefined') ? Tools.degreesToRadians(60) : Tools.degreesToRadians(this.fov);
    this.polygon = [];
    this.heading = 0;
    this.source = new Vec2(canvas.width/2, canvas.height/2);
    this.colour = 'rgba(255,255,255,0.1)';
}

Vision.prototype = {

    getPoints: function(segments) {
        var a = [];
        for (var i = 0; i < segments.length; i++) { a.push(segments[i].a, segments[i].b); }
        return a;
    },

    uniquePoints: function(points) {
        var set = {};
        return points.filter(function(p) {
            var key = p.x + "," + p.y;
            if (key in set) {
                return false;
            } else {
                set[key] = true;
                return true;
            }
        });
    },

    calcAngles: function(points, fovMin, fovMax) {
        var angles = [];
        var precision = 0.000001;
        angles.push(fovMin, fovMax);
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            var angle = this.source.angleTo(new Vec2(point.x, point.y));
            if (!Tools.radianBetween(angle, fovMin, fovMax)) continue;
            angles.push(Tools.normaliseRadian(angle - precision));
            angles.push(Tools.normaliseRadian(angle));
            angles.push(Tools.normaliseRadian(angle + precision));
        }
        return angles;
    },

    calcIntersects: function(angles, wallSegments) {
        var intersects = [];

        for (var i = 0; i < angles.length; i++) {
            var angle = angles[i];

            var delta = new Vec2(Math.cos(angle), Math.sin(angle));
            var ray = new Ray(this.source, this.source.add(delta));

            var closestIntersect = null;

            for (var j = 0; j < wallSegments.length; j++) {
                var intersection = Tools.calcIntersection(ray, wallSegments[j]);
                if (!intersection) continue;
                if(!closestIntersect || intersection.param < closestIntersect.param) { closestIntersect = intersection; }
            }

            if(!closestIntersect) continue;

            closestIntersect.angle = angle;
            intersects.push(closestIntersect);
        }

        intersects = intersects.sort(function(a, b) { return a.angle - b.angle; });
        return intersects;
    },

    buildPolygon: function(intersects) {
        this.polygon = [];
        this.polygon.push(this.source);
        for(var i = 0; i < intersects.length; i++) {
            this.polygon.push(new Vec2(intersects[i].x, intersects[i].y));
        }
    },

    calc: function(wallSegments) {
        var points = this.getPoints(wallSegments);
        var uniquePoints = this.uniquePoints(points);

        var fovMin = Tools.normaliseRadian(this.heading - (this.fov/2));
        var fovMax = Tools.normaliseRadian(this.heading + (this.fov/2));

        var angles = this.calcAngles(uniquePoints, fovMin, fovMax);

        var intersects = this.calcIntersects(angles, wallSegments);

        Tools.rotateArray(intersects, Tools.findInArrayWithAttr(intersects, "angle", fovMin));

        this.buildPolygon(intersects);
    },

    headingInDegrees: function(degrees) { this.heading = Tools.degreesToRadians(degrees); },

    setFOV: function(fov) { this.fov = Tools.degreesToRadians(fov); },

    incFOV: function(inc) { this.fov = this.fov + Tools.degreesToRadians(inc); },

    setColour: function(colour) { this.colour = colour; },

    contains: function(point) { return Tools.pointInPolygon(this.polygon, point); },
};
