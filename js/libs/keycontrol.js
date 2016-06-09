var Key = {
    _pressed: {},

    ONE: 49,
    TWO: 50,
    THREE: 51,
    FOUR: 52,
    FIVE: 53,
    SIX: 54,
    SEVEN: 55,
    EIGHT: 56,
    NINE: 57,
    ZERO: 48,

    SPACE: 32,
    ENTER: 13,
    ESC: 27,

    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,

    LSqrBrkt: 219,
    RSqrBrkt: 221,

    isDown: function(keyCode) { return this._pressed[keyCode]; },
    onKeydown: function(event) { this._pressed[event.keyCode] = true; },
    onKeyup: function(event) { delete this._pressed[event.keyCode]; }
};

// Build codes for letter keys
for(var i=65; i<91; i++) { Key[String.fromCharCode(i)] = i; }

window.addEventListener('keyup', function(event) {
    Key.onKeyup(event);
}, false);

window.addEventListener('keydown', function(event) {
    Key.onKeydown(event);
}, false);
