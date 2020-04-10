// https://stackoverflow.com/a/42535
function rotCW(matrix, n) {
    var ret = new Array(n);
    for (var i = 0; i < n; i++) {
        ret[i] = (new Array(n)).fill(false);
    }

    for (var i = 0; i < n; ++i) {
        for (var j = 0; j < n; ++j) {
            ret[i][j] = matrix[n - j - 1][i];
        }
    }

    return ret;
}

function rotCWW(matrix, n) {
    var ret = new Array(n);
    for (var i = 0; i < n; i++) {
        ret[i] = (new Array(n)).fill(false);
    }

    for (var i = 0; i < n; ++i) {
        for (var j = 0; j < n; ++j) {
            ret[i][j] = matrix[j][n - i - 1];
        }
    }

    return ret;
}

function colliding(matrix, x, y) {
    const size = matrix.length;
    const bh = board.length - 1;
    const bw = board[0].length - 1;

    for (var sy = y, ey = y + size; sy < ey; sy++) {
        for (var sx = x, ex = x + size; sx < ex; sx++) {
            if (matrix[sy - y][sx - x]) {
                if (sx < 0 || sy < 0 || sy > bh || sx > bw) {
                    return true;
                }
                if (board[sy][sx]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function placePiece() {
    if (pieceName === "t" && lastMoveWasSpin === true) {
        var corners = 0;
        if (px !== -1) {
            if (board[py][px]) { ++corners; }
        } else {
            corners++;
        }
        if (px + 2 < board[0].length) {
            if (board[py][px + 2]) { ++corners; }
        } else {
            ++corners;
        }
        if (py + 2 < board.length && px !== -1) {
            if (board[py + 2][px]) { ++corners; }
        } else {
            ++corners;
        }
        if (px + 2 < board[0].length && py + 2 < board.length) {
            if (board[py + 2][px + 2]) { ++corners; }
        } else {
            ++corners;
        }
        if (corners >= 3) {
            play(sounds.spin);
            addToTextBuffer("t spin ");
        }
    }
    for (var y = 0; y < piece.length; y++) {
        for (var x = 0; x < piece[0].length; x++) {
            if (piece[y][x]) {
                board[py + y][px + x] = piece[y][x];
            }
        }
    }
    hold.used = false;
}