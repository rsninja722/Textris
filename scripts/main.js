var game = document.getElementById("game");
var time;
var states = { title: 0, count: 1, playing: 2, end: 3, paused: 4 };
var state = states.title;
var lastState;
var frameCount = 0;

addListenersTo(document.body);

function draw() {
    game.innerText = "";
    switch (state) {
        case states.title:
            game.innerText = generateMenu();
            break;
        case states.count:
            game.innerText = generateCountDownText();
            break;
        case states.playing:
            game.innerText = drawPlaying();
            break;
        case states.end:
            game.innerText = drawEnd();
            break;
        case states.paused:
            game.innerText = drawPause();
            break;
    }
    requestAnimationFrame(draw);
}

function updateLoop() {
    time = Date.now();

    handleInput();

    var newState = false;
    if (state !== lastState) {
        newState = true;
    }
    lastState = state;

    switch (state) {
        case states.title:
            handleTitle(newState);
            break;
        case states.count:
            handleCountDown(newState);
            break;
        case states.playing:
            handlePlaying(newState);
            break;
        case states.end:
            handleEnd(newState);
            break;
        case states.paused:
            handlePause(newState);
            break;
    }

    resetInput();
    ++frameCount;
}
setInterval(updateLoop, 10);
requestAnimationFrame(draw);