var arr = 20;//ms
var das = 150;//ms
var softDrop = 20;//ms
var gravity = 300;//ms
var placeDelay = 500;//ms
var keysBindings = {
    cww: k.z,
    cw: k.x,
    hold: k.c,
    hardDrop: k.SPACE,
    softDrop: k.DOWN,
    left: k.LEFT,
    right: k.RIGHT
};

if(localStorage.textris !== undefined) {
    var settings = JSON.parse(localStorage.textris);
    arr = settings.arr;
    das = settings.das;
    softDrop = settings.softDrop;
    gravity = settings.gravity;
    placeDelay = settings.placeDelay;
    keysBindings.cww = settings.keysBindings.cww;
    keysBindings.cw = settings.keysBindings.cw;
    keysBindings.hold = settings.keysBindings.hold;
    keysBindings.hardDrop = settings.keysBindings.hardDrop;
    keysBindings.softDrop = settings.keysBindings.softDrop;
    keysBindings.left = settings.keysBindings.left;
    keysBindings.right = settings.keysBindings.right; 
}