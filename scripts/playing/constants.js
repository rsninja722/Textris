const pieces = [
    [ // i
        [false, false, false, false],
        [true, true, true, true],
        [false, false, false, false],
        [false, false, false, false],
    ],
    [ // o
        [false, false, false, false],
        [false, true, true, false],
        [false, true, true, false],
        [false, false, false, false],
    ],
    [ // j
        [true, false, false],
        [true, true, true],
        [false, false, false]
    ],
    [ // l
        [false, false, true],
        [true, true, true],
        [false, false, false]
    ],
    [ // s
        [false, true, true],
        [true, true, false],
        [false, false, false]
    ],
    [ // z
        [true, true, false],
        [false, true, true],
        [false, false, false]
    ],
    [ // t
        [false, true, false],
        [true, true, true],
        [false, false, false]
    ]
];

const pieceNames = [
    "i",
    "o",
    "j",
    "l",
    "s",
    "z",
    "t"
]

const kickTable = {
    norm01: [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    norm10: [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
    norm12: [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
    norm21: [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    norm23: [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
    norm32: [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
    norm30: [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
    norm03: [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
    line01: [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
    line10: [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
    line12: [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
    line21: [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
    line23: [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
    line32: [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
    line30: [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
    line03: [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]]
}