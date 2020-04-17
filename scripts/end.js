var endMessage = "";
var inputDelay;

const endUI = [
    "play again",
    "main menu"
];

var EndUIIndex = 0;

function EndMenuUp() {
    if (EndUIIndex > 0) {
        --EndUIIndex;
    } else {
        EndUIIndex = endUI.length - 1;
    }
    play(sounds.move);
}

function EndMenuDown() {
    if (EndUIIndex < endUI.length - 1) {
        ++EndUIIndex;
    } else {
        EndUIIndex = 0;
    }
    play(sounds.move);
}

function EndMenuSelect() {
    var selection = endUI[EndUIIndex];
    if (selection === "play again") {
        state = states.count;
    }
    if (selection === "main menu") {
        state = states.title;
    }
}

function handleEnd(isNewState) {
    if (isNewState) {
        game.style.letterSpacing = "";
        inputWait = time;
    }
}

function drawEnd() {
    var txt = "";
    txt += endMessage + "\n\n";
    for (var i = 0; i < endUI.length; i++) {
        txt += endUI[i];
        txt += (~~(frameCount / 20) % 2 && EndUIIndex === i ? "_" : "") + "\n\n";
    }
    return txt;
}