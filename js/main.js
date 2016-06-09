var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var now;
var delta;
var then = Date.now();
var interval = 1000/30;

var assets = {
    base: '../assets/',
    paths: ['gb_walk.png', 'coin.png']
};

var AM = new AssetManager(assets);
AM.downloadAll(init);

function Coin() {
    this.anim = new Animator(AM.get('img.coin'), 44, 40);
    this.anim.setSequence('still', [10], null);
    this.anim.setSequence('spin', [10,1,2,3,4,5,6,7,8,9], 1);
    this.position = new Vec2(canvas.width/2, canvas.height/2);

    this.draw = function() {
        ctx.drawImage(this.anim.getFrame(delta), this.position.x, this.position.y);
    };
}

var coin = new Coin();
coin.anim.play('spin');

function init() {
    loop();
}

function update() {
    if (Key.isDown(Key.P)) { coin.anim.play('spin'); }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    coin.draw();
}

function loop() {
    requestAnimationFrame(loop);

    now = Date.now();
    delta = (now - then) / 1000;

    update();
    draw();

    then = now;
}

// init is called when all assets are loaded
// init();
