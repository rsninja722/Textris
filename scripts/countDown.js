var countDownStart;
var lastNumber;
function handleCountDown(isNewState) {
    if (isNewState) {
        game.style.letterSpacing = "-4px";
        countDownStart = time;
    }
    var countTime = 3 + (countDownStart - time) / 1000;
    if (countTime <= 0) {
        play(sounds.rotate);
        state = states.playing;
        reset();
    }
}


function generateCountDownText() {
    var txt = "\n\np or esc to pause\n\nr or f4  to reset\n\n\n\n\n\n\n                    ";
    var countTime = 3 + (countDownStart - time) / 1000;
    var num;
    if (countTime < 1) {
        num = "1";
    } else if (countTime < 2) {
        num = "2";
    } else {
        num = "3";
    }
    if (num !== lastNumber) {
        play(sounds.move);
    }
    lastNumber = num;
    txt += num;
    return txt;
}