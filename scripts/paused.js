var pauseTime;

function drawPause() {
    return "paused\n\npress p or ESC to resume";
}

function handlePause(isNewState) {
    if(isNewState) {
        inputWait = time;
        pauseTime = time;
    }
}