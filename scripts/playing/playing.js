var piece;
var px;
var py;
var prot;
var pieceName;
var bag = [];
var preview = [];
var previewNames = [];
var clears = [];
var animationColumns = [];
var linesCleared = 0;
var lastMoveWasSpin = false;
var textBuffer = [];
var hold = {
    piece: undefined,
    pieceName: undefined,
    used: false
};
var hold = {
    left: 0,
    right: 0
};
var board = [];

var timers = {
    arrl: 0,
    arrr: 0,
    das: 0,
    softDrop: 0,
    gravity: 0,
    place: 0,
    spin: 0,
    dropAnimation: 0,
    game: 0
};

function handlePlaying(isNewState) {
    if (!(frameCount % 7)) {
        textBuffer.shift();
    }

    if (isNewState) {
        reset();
        var keys = Object.keys(timers);
        for (var i = 0; i < keys.length; i++) {
            timers[keys[i]] = time;
        }
    }

    if (piece === undefined) {
        nextPiece(false);
    }

    // gravity
    if (time - timers.gravity > gravity) {
        if (!colliding(piece, px, py + 1)) {
            ++py;
            timers.place = time;
        } else {
            if (time - timers.place > placeDelay) {
                placePiece();
                play(sounds.place);
                piece = undefined;
                return;
            }
        }
        timers.gravity = time;
    }

    // hold
    if (keyPress[keysBindings.hold] && !hold.used) {
        play(sounds.hold);
        var pieceCache = pieces[pieceNames.indexOf(pieceName)].slice();
        var pieceNameCache = pieceName;
        if (hold.piece === undefined) {
            nextPiece(false);
        } else {
            nextPiece(true);
        }
        hold.piece = pieceCache;
        hold.pieceName = pieceNameCache;
        hold.used = true;
    }

    fillPreview();

    // cw
    if (keyPress[keysBindings.cw]) {
        var shallowCopy = piece.slice();
        var kicks = kickTable[`${pieceName === "i" ? "line" : "norm"}${prot}${(prot + 1) % 4}`];
        shallowCopy = rotCW(shallowCopy, shallowCopy.length);
        for (var i = 0; i < 5; i++) {
            if (!colliding(shallowCopy, px + kicks[i][0], py - kicks[i][1])) {
                piece = shallowCopy;
                px += kicks[i][0];
                py -= kicks[i][1];
                ++prot;
                prot = prot % 4;
                timers.place = time;
                play(sounds.rotate);
                lastMoveWasSpin = true;
                break;
            }
        }
    }

    // cww
    if (keyPress[keysBindings.cww]) {
        var shallowCopy = piece.slice();
        var kicks = kickTable[`${pieceName === "i" ? "line" : "norm"}${prot}${prot - 1 < 0 ? 3 : prot - 1}`];
        shallowCopy = rotCWW(shallowCopy, shallowCopy.length);
        for (var i = 0; i < 5; i++) {
            if (!colliding(shallowCopy, px + kicks[i][0], py - kicks[i][1])) {
                piece = shallowCopy;
                px += kicks[i][0];
                py -= kicks[i][1];
                --prot;
                prot = prot < 0 ? 3 : prot;
                timers.place = time;
                play(sounds.rotate);
                lastMoveWasSpin = true;
                break;
            }
        }
    }

    // left
    if (keyPress[keysBindings.left]) {
        if (!colliding(piece, px - 1, py)) {
            --px;
            timers.place = time;
            timers.arrl = time;
            play(sounds.move);
            lastMoveWasSpin = false;
        }
        timers.das = time;
    }
    if (keyDown[keysBindings.left]) {
        if (time - timers.das > das) {
            if (arr == 0) {
                while (!colliding(piece, px - 1, py)) {
                    --px;
                    timers.place = time;
                    lastMoveWasSpin = false;
                }
            } else {
                if (time - timers.arrl > arr) {
                    if (!colliding(piece, px - 1, py)) {
                        --px;
                        timers.place = time;
                        play(sounds.move);
                        lastMoveWasSpin = false;
                    }
                    timers.arrl = time;
                }
            }
        }
    }


    // right
    if (keyPress[keysBindings.right]) {
        if (!colliding(piece, px + 1, py)) {
            ++px;
            timers.place = time;
            timers.arrr = time;
            play(sounds.move);
            lastMoveWasSpin = false;
        }
        timers.das = time;
    }
    if (keyDown[keysBindings.right]) {
        if (time - timers.das > das) {
            if (arr == 0) {
                while (!colliding(piece, px + 1, py)) {
                    ++px;
                    timers.place = time;
                    lastMoveWasSpin = false;
                }
            } else {
                if (time - timers.arrr > arr) {
                    if (!colliding(piece, px + 1, py)) {
                        ++px;
                        timers.place = time;
                        play(sounds.move);
                        lastMoveWasSpin = false;
                    }
                    timers.arrr = time;
                }
            }
        }
    }

    // softDrop
    if (keyPress[keysBindings.softDrop]) {
        if (!colliding(piece, px, py + 1)) {
            ++py;
            timers.softDrop = time;
            timers.place = time;
            play(sounds.move);
            lastMoveWasSpin = false;
        }
    }
    if (keyDown[keysBindings.softDrop]) {
        if (time - timers.softDrop > softDrop) {
            if (softDrop == 0) {
                while (!colliding(piece, px, py + 1)) {
                    ++py;
                    timers.place = time;
                    lastMoveWasSpin = false;
                }
            } else {
                if (time - timers.softDrop > softDrop) {
                    if (!colliding(piece, px, py + 1)) {
                        ++py;
                        timers.softDrop = time;
                        timers.place = time;
                        play(sounds.move);
                        lastMoveWasSpin = false;
                    }
                }
            }
        }
    }

    // hardDrop
    if (keyPress[keysBindings.hardDrop]) {
        animationColumns = [];
        for (var y = 0; y < piece.length; y++) {
            for (var x = 0; x < piece[0].length; x++) {
                if (piece[y][x]) {
                    if (!animationColumns.includes(x + px)) {
                        animationColumns.push(x + px);
                    }
                }
            }
        }
        timers.dropAnimation = time;
        while (!colliding(piece, px, py + 1)) {
            ++py;
            lastMoveWasSpin = false;
        }
        play(sounds.drop);
        placePiece();
        piece = undefined;
    }

    // clear lines
    clearCount = 0;
    for (var y = 0; y < board.length; y++) {
        var complete = true;
        for (var x = 0; x < board[0].length; x++) {
            if (!board[y][x]) {
                complete = false;
                break;
            }
        }
        if (complete) {
            board.splice(y, 1);
            board.unshift(new Array(board[0].length).fill(false));
            clears.push(y);
            timers.spin = time;
            ++linesCleared;
            ++clearCount;
            if (linesCleared >= 40) {
                state = states.end;
            }
        }
    }
    if (clearCount > 0) {
        play(sounds[`clear${clearCount}`]);
        switch (clearCount) {
            case 1:
                addToTextBuffer("single ");
                break;
            case 2:
                addToTextBuffer("double ");
                break;
            case 3:
                addToTextBuffer("triple ");
                break;
            case 4:
                addToTextBuffer("textris ");
                break;
        }
    }
}

function nextPiece(useHold) {
    if (useHold) {
        piece = hold.piece.slice();
        pieceName = hold.pieceName;
    } else {
        piece = preview.splice(0, 1)[0];
        pieceName = previewNames.splice(0, 1)[0];
    }
    px = 4;
    py = 1;
    prot = 0;
    if (colliding(piece, px, py)) {
        state = states.count;
    }
}

function reset() {
    makeBoard();
    piece = undefined;
    preview = [];
    previewNames = [];
    animationColumns = [];
    clears = [];
    bag = [0, 1, 2, 3, 4, 5, 6];
    hold = {
        piece: undefined,
        pieceName: undefined,
        used: false
    };
    fillPreview();
    timers.game = time;
}

function makeBoard() {
    board = [];
    for (var y = 0; y < 22; y++) {
        var tempArray = [];
        for (var x = 0; x < 10; x++) {
            tempArray.push(false);
        }
        board.push(tempArray);
    }
};

function fillPreview() {
    while (preview.length < 5) {
        const index = rand(0, bag.length - 1);
        const pieceIndex = bag.splice(index, 1);
        preview.push(pieces[pieceIndex].slice());
        previewNames.push(pieceNames[pieceIndex]);
        if (bag.length === 0) {
            bag = [0, 1, 2, 3, 4, 5, 6];
        }
    }
}

function drawPlaying() {
    // board of dots
    var printBoard = [];
    for (var y = 0; y < 22; y++) {
        var tempArray = [];
        for (var x = 0; x < 40; x++) {
            if (x > 8 && x < 30 && y > 1 && x % 2) {
                tempArray.push(".");
            } else {
                tempArray.push(" ");
            }
        }
        printBoard.push(tempArray);
    }

    if (time - timers.dropAnimation < 300) {
        var height = ~~((time - timers.dropAnimation) / 10);
        height = height > 19 ? 19 : height;

        for (var i = 0; i < animationColumns.length; i++) {
            var x = animationColumns[i] * 2 + 10;
            for (var y = 2 + height; y < 22; y++) {
                printBoard[y][x] = ":";
                printBoard[y][x + 1] = ":";
            }
        }
    }
    if (time - timers.spin > 1000) {
        clears = [];
    }

    var cycle = (~~((time - timers.spin + 100) / ((time - timers.spin) / 20))) % 3;
    for (var i = 2; i < 22; i++) {
        var char = "|";
        if (clears.includes(i)) {
            char = cycle == 0 ? "|" : (cycle == 1 ? "\\" : "/");
        }
        printBoard[i][9] = char;
        printBoard[i][30] = char;
    }

    drawBoard(printBoard);

    drawGhost(printBoard);

    drawPiece(printBoard);

    drawHold(printBoard);

    drawPreview(printBoard);

    textToBoard(printBoard, textBuffer.slice(0, textBuffer.length < 20 ? textBuffer.length : 20).join(""), 10, 1);

    textToBoard(printBoard, "clear " + (40 - linesCleared), 0, 18);
    textToBoard(printBoard, "time:  " + (time - timers.game) / 1000, 18, 0);
    textToBoard(printBoard, `${keyDown[keysBindings.cww] ? "-" : "#"}${keyDown[keysBindings.cw] ? "-" : "#"} ${keyDown[keysBindings.hold] ? "-" : "#"}  ${keyDown[keysBindings.hardDrop] ? "-" : "#"}  ${keyDown[keysBindings.left] ? "-" : "#"}${keyDown[keysBindings.softDrop] ? "-" : "#"}${keyDown[keysBindings.right] ? "-" : "#"}`, 0, 0);

    var txt = "";
    for (var y = 0; y < printBoard.length; y++) {
        line = ""
        for (var x = 0; x < printBoard[0].length; x++) {
            line += printBoard[y][x];
        }
        txt += line + "\n";
    }

    // play in console
    // console.clear();
    // console.log(txt);
    return txt;
}

function addToTextBuffer(txt) {
    var buffStr = textBuffer.join("");
    if (buffStr.length < 18) {
        txt = "".padStart(18 - buffStr.length, " ") + txt;
    }
    var chars = txt.split("");
    for (let i = 0; i < chars.length; i++) {
        textBuffer.push(chars[i]);
    }
}

function textToBoard(matrix, txt, x, y) {
    for (var i = 0; i < txt.length; i++) {
        matrix[y][x + i] = txt[i];
    }
}

function drawBoard(matrix) {
    for (var y = 2; y < board.length; y++) {
        for (var x = 0; x < board[0].length; x++) {
            if (board[y][x]) {
                const xpos = x * 2 + 10;
                matrix[y][xpos] = "[";
                matrix[y][xpos + 1] = "]";
            }
        }
    }
}

function drawGhost(matrix) {
    if (piece !== undefined) {
        var shallowCopy = piece.slice();
        var tempY = py;
        while (!colliding(shallowCopy, px, tempY + 1)) {
            ++tempY;
        }
        for (var y = 0; y < piece.length; y++) {
            for (var x = 0; x < piece[0].length; x++) {
                if (piece[y][x]) {
                    const xpos = px * 2 + x * 2 + 10;
                    const ypos = tempY + y;
                    if (ypos > 1) {
                        matrix[ypos][xpos] = "(";
                        matrix[ypos][xpos + 1] = ")";
                    }
                }
            }
        }
    }
}

function drawPiece(matrix) {
    if (piece !== undefined) {
        for (var y = 0; y < piece.length; y++) {
            for (var x = 0; x < piece[0].length; x++) {
                if (piece[y][x]) {
                    const xpos = px * 2 + x * 2 + 10;
                    const ypos = py + y;
                    if (ypos > 1) {
                        matrix[ypos][xpos] = "[";
                        matrix[ypos][xpos + 1] = "]";
                    }
                }
            }
        }
    }
}

function drawHold(matrix) {
    if (hold.piece !== undefined) {
        for (var y = 0; y < hold.piece.length; y++) {
            for (var x = 0; x < hold.piece[0].length; x++) {
                if (hold.piece[y][x]) {
                    const xpos = x * 2;
                    const ypos = y + 2;
                    matrix[ypos][xpos] = "[";
                    matrix[ypos][xpos + 1] = "]";
                }
            }
        }
    }
}

function drawPreview(matrix) {
    for (var i = 0; i < preview.length; i++) {
        const p = preview[i];
        for (var y = 0; y < p.length; y++) {
            for (var x = 0; x < p[0].length; x++) {
                if (p[y][x]) {
                    const xpos = 32 + x * 2;
                    const ypos = 2 + y + i * 4;
                    matrix[ypos][xpos] = "[";
                    matrix[ypos][xpos + 1] = "]";
                }
            }
        }
    }
}

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }