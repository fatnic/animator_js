function Animator(image, frameWidth, frameHeight) {
    this.image = image;
    this.imgWidth = image.width;
    this.imgHeight = image.height;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.sequences = [];
    this.currentSequence = null;
    this.timer = 0;

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.width = this.frameWidth;
    this.canvas.height = this.frameHeight;
}

Animator.prototype.addSequence = function (name, frames, time) {
    sequence = {};
    sequence.name = name;
    sequence.frames = frames;
    sequence.delay = (time === null) ? null : time / frames.length;
    sequence.currentFrame = 0;
    this.sequences.push(sequence);
    if (this.currentSequence === null) { this.currentSequence = sequence; }
};

Animator.prototype.play = function (sequence) {
    var seq = this.sequences.filter(function(s){ return s.name == sequence; });
    if(seq) { this.currentSequence = seq[0]; }
};

Animator.prototype.getFrame = function (delta) {

    this.timer += delta;
    var frameNo = 0;

    if(this.currentSequence.delay !== null) {
        if(this.timer > this.currentSequence.delay) {
            this.currentSequence.currentFrame++;
            this.timer = 0;
        }
        frameNo = this.currentSequence.currentFrame % (this.imgWidth / this.frameWidth);
    }

    var frame = Tools.i2xy(this.currentSequence.frames[frameNo] - 1, this.imgWidth/this.frameWidth);
    var x = frame[0] * this.frameWidth;
    var y = frame[1] * this.frameHeight;
    this.context.clearRect(0, 0, this.frameWidth, this.frameHeight);
    this.context.drawImage(this.image, x, y, this.frameWidth, this.frameHeight, 0, 0, this.frameWidth, this.frameHeight);
    return this.canvas;
};
