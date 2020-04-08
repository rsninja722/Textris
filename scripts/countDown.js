var countDownStart;
var lastNumber;
function handleCountDown(isNewState) {
    if (isNewState) {
        game.style.letterSpacing = "-4px";
        countDownStart = time;
        if (abuffer.length === 0) {
            loadSounds();
        }
    }
    var countTime = 3 + (countDownStart - time) / 1000;
    if (countTime <= 0) {
        play(sounds.rotate);
        state = states.playing;
    }
}


function generateCountDownText() {
    var txt = "";
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