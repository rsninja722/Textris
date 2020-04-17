const UI = [
    [
        "play",
        "options",
        "exit"
    ],
    [
        "save and return to menu",
        "sfx",
        "left",
        "right",
        "cw",
        "ccw",
        "hold",
        "hard",
        "soft",
        "das",
        "arr",
        "soft speed",
        "gravity",
        "place delay"
    ]
];

const optionTypes = [
    "none",
    "slider",
    "key",
    "key",
    "key",
    "key",
    "key",
    "key",
    "key",
    "slider",
    "slider",
    "slider",
    "slider",
    "slider"
];

const sliderMaxCur = [
    [0, 0],
    [200, 100],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [200, das],
    [100, arr],
    [100, softDrop],
    [1000, gravity],
    [1000, placeDelay],
];

var UIIndex = 0;
var curMenu = 0;
var listeningForBind = false;
var timeOut = 0;
var personalTimes = "";

function handleTitle(isNewState) {
    if(isNewState) {
        if(localStorage.TextrisTimes !== undefined) {
            var tempTimes = localStorage.TextrisTimes.split(",");
            tempTimes.pop();
            for(var i=0;i<tempTimes.length;i++) {
                tempTimes[i] = parseFloat(tempTimes[i]);
            }
            tempTimes.sort(function (a, b) {
                if (a > b) return 1;
                if (b > a) return -1;
                return 0;
            });
            var tempStr = "\npersonal times\n\n";
            for(var i=0;i<tempTimes.length;i++) {
                tempStr += tempTimes[i] + "\n";
            }
            personalTimes = tempStr;
        }
    }
}

function menuUp() {
    if (UIIndex > 0) {
        --UIIndex;
    } else {
        UIIndex = UI[curMenu].length - 1;
    }
    play(sounds.move);
}

function menuDown() {
    if (UIIndex < UI[curMenu].length - 1) {
        ++UIIndex;
    } else {
        UIIndex = 0;
    }
    play(sounds.move);
}

function menuRight() {
    if (curMenu === 1) {
        if (optionTypes[UIIndex] === "slider") {
            if (sliderMaxCur[UIIndex][1] < sliderMaxCur[UIIndex][0]) {
                sliderMaxCur[UIIndex][1] += 10;
                specificAction();
            }
        }
    }
}

function menuLeft() {
    if (curMenu === 1) {
        if (optionTypes[UIIndex] === "slider") {
            if (sliderMaxCur[UIIndex][1] > 0) {
                sliderMaxCur[UIIndex][1] -= 10;
                specificAction();
            }
        }
    }
}

function specificAction() {
    if (UIIndex === 1) {
        sfxVolumeNode.gain.value = sliderMaxCur[1][1] / 100;
    }
    if (UIIndex === 9) {
        das = sliderMaxCur[9][1];
    }
    if (UIIndex === 10) {
        arr = sliderMaxCur[10][1];
    }
    if (UIIndex === 11) {
        softDrop = sliderMaxCur[11][1];
    }
    if (UIIndex === 12) {
        gravity = sliderMaxCur[12][1];
    }
    if (UIIndex === 13) {
        placeDelay = sliderMaxCur[13][1];
    }
    play(sounds.move);
}

function menuSelect() {
    var selection = UI[curMenu][UIIndex];
    if (selection === "play") {
        state = states.count;
    }
    if (selection === "options") {
        UIIndex = 0;
        curMenu = 1;
    }
    if (selection === "save and return to menu") {
        UIIndex = 0;
        curMenu = 0;
        saveSettings();
    }
    if (selection === "exit") {
        window.location.replace("https://rsninja.dev/index.html");
    }
    if(curMenu === 1 && optionTypes[UIIndex] === "key") {
        if(Date.now() - timeOut > 200) {
            listeningForBind = true;
        }
    }
}

function bindKey(e) {
    if(listeningForBind) {
        switch(UIIndex) {
            case 2:
                keysBindings.left = e.keyCode;
            break;
            case 3:
                keysBindings.right = e.keyCode;
            break;
            case 4:
                keysBindings.cw = e.keyCode;
            break;
            case 5:
                keysBindings.cww = e.keyCode;
            break;
            case 6:
                keysBindings.hold = e.keyCode;
            break;
            case 7:
                keysBindings.hardDrop = e.keyCode;
            break;
            case 8:
                keysBindings.softDrop = e.keyCode;
            break;
        }
        timeOut = Date.now();
        listeningForBind = false;
    }
}

function saveSettings() {
    var exportObj = {};
    exportObj.sfx = sliderMaxCur[1][1];
    exportObj.das = sliderMaxCur[9][1];
    exportObj.arr = sliderMaxCur[10][1];
    exportObj.softDrop = sliderMaxCur[11][1];
    exportObj.gravity = sliderMaxCur[12][1];
    exportObj.placeDelay = sliderMaxCur[13][1];
    exportObj.keysBindings = {
        cww: keysBindings.cww,
        cw: keysBindings.cw,
        hold: keysBindings.hold,
        hardDrop: keysBindings.hardDrop,
        softDrop: keysBindings.softDrop,
        left: keysBindings.left,
        right: keysBindings.right
    };
    localStorage.textris = JSON.stringify(exportObj);
}

function generateMenu() {
    var txt = curMenu === 0 ? "Textris\n\narrow keys to navigate\nspace to select\n___________________________\n\n" : "Options\n___________________________\n\n";
    var tempMenu = UI[curMenu];
    for (var i = 0; i < tempMenu.length; i++) {
        txt += tempMenu[i];
        txt += (optionTypes[i] === "slider" && curMenu === 1 ? generateSlider(i) : ""); 
        txt += (optionTypes[i] === "key" && curMenu === 1 ? " " + generateKey(i) : ""); 
        txt += (~~(frameCount / 20) % 2 && UIIndex === i ? "_" : "") + "\n\n";
    }
    txt += curMenu === 0 ? personalTimes : "";
    return txt;
}

function generateKey(index) {
    if(index === UIIndex && listeningForBind === true) {
        return "press any key";
    }
    switch(index) {
        case 2:
            return keyboardMap[keysBindings.left];
        break;
        case 3:
            return keyboardMap[keysBindings.right];
        break;
        case 4:
            return keyboardMap[keysBindings.cw];
        break;
        case 5:
            return keyboardMap[keysBindings.cww];
        break;
        case 6:
            return keyboardMap[keysBindings.hold];
        break;
        case 7:
            return keyboardMap[keysBindings.hardDrop];
        break;
        case 8:
            return keyboardMap[keysBindings.softDrop];
        break;
    }
}

function generateSlider(index) {
    var max = sliderMaxCur[index][0] / 10;
    var fill = sliderMaxCur[index][1] / 10;

    if (max === 100) {
        max /= 10;
        fill /= 10;
    }

    var ret = "";
    ret += " <";
    for (var j = 0; j < fill; j++) {
        ret += "=";
    }
    for (var j = 0; j < max - fill; j++) {
        ret += "-";
    }
    ret += "> ";
    if ((index === 10 || index === 11) && sliderMaxCur[index][1] === 0) {
        ret += "instant";
    } else {
        ret += sliderMaxCur[index][1];
    }
    return ret;
}

//https://stackoverflow.com/a/23377822
var keyboardMap = [
    "", // [0]
    "", // [1]
    "", // [2]
    "CANCEL", // [3]
    "", // [4]
    "", // [5]
    "HELP", // [6]
    "", // [7]
    "BACK_SPACE", // [8]
    "TAB", // [9]
    "", // [10]
    "", // [11]
    "CLEAR", // [12]
    "ENTER", // [13]
    "ENTER_SPECIAL", // [14]
    "", // [15]
    "SHIFT", // [16]
    "CONTROL", // [17]
    "ALT", // [18]
    "PAUSE", // [19]
    "CAPS_LOCK", // [20]
    "KANA", // [21]
    "EISU", // [22]
    "JUNJA", // [23]
    "FINAL", // [24]
    "HANJA", // [25]
    "", // [26]
    "ESCAPE", // [27]
    "CONVERT", // [28]
    "NONCONVERT", // [29]
    "ACCEPT", // [30]
    "MODECHANGE", // [31]
    "SPACE", // [32]
    "PAGE_UP", // [33]
    "PAGE_DOWN", // [34]
    "END", // [35]
    "HOME", // [36]
    "LEFT", // [37]
    "UP", // [38]
    "RIGHT", // [39]
    "DOWN", // [40]
    "SELECT", // [41]
    "PRINT", // [42]
    "EXECUTE", // [43]
    "PRINTSCREEN", // [44]
    "INSERT", // [45]
    "DELETE", // [46]
    "", // [47]
    "0", // [48]
    "1", // [49]
    "2", // [50]
    "3", // [51]
    "4", // [52]
    "5", // [53]
    "6", // [54]
    "7", // [55]
    "8", // [56]
    "9", // [57]
    "COLON", // [58]
    "SEMICOLON", // [59]
    "LESS_THAN", // [60]
    "EQUALS", // [61]
    "GREATER_THAN", // [62]
    "QUESTION_MARK", // [63]
    "AT", // [64]
    "A", // [65]
    "B", // [66]
    "C", // [67]
    "D", // [68]
    "E", // [69]
    "F", // [70]
    "G", // [71]
    "H", // [72]
    "I", // [73]
    "J", // [74]
    "K", // [75]
    "L", // [76]
    "M", // [77]
    "N", // [78]
    "O", // [79]
    "P", // [80]
    "Q", // [81]
    "R", // [82]
    "S", // [83]
    "T", // [84]
    "U", // [85]
    "V", // [86]
    "W", // [87]
    "X", // [88]
    "Y", // [89]
    "Z", // [90]
    "OS_KEY", // [91] Windows Key (Windows) or Command Key (Mac)
    "", // [92]
    "CONTEXT_MENU", // [93]
    "", // [94]
    "SLEEP", // [95]
    "NUMPAD0", // [96]
    "NUMPAD1", // [97]
    "NUMPAD2", // [98]
    "NUMPAD3", // [99]
    "NUMPAD4", // [100]
    "NUMPAD5", // [101]
    "NUMPAD6", // [102]
    "NUMPAD7", // [103]
    "NUMPAD8", // [104]
    "NUMPAD9", // [105]
    "MULTIPLY", // [106]
    "ADD", // [107]
    "SEPARATOR", // [108]
    "SUBTRACT", // [109]
    "DECIMAL", // [110]
    "DIVIDE", // [111]
    "F1", // [112]
    "F2", // [113]
    "F3", // [114]
    "F4", // [115]
    "F5", // [116]
    "F6", // [117]
    "F7", // [118]
    "F8", // [119]
    "F9", // [120]
    "F10", // [121]
    "F11", // [122]
    "F12", // [123]
    "F13", // [124]
    "F14", // [125]
    "F15", // [126]
    "F16", // [127]
    "F17", // [128]
    "F18", // [129]
    "F19", // [130]
    "F20", // [131]
    "F21", // [132]
    "F22", // [133]
    "F23", // [134]
    "F24", // [135]
    "", // [136]
    "", // [137]
    "", // [138]
    "", // [139]
    "", // [140]
    "", // [141]
    "", // [142]
    "", // [143]
    "NUM_LOCK", // [144]
    "SCROLL_LOCK", // [145]
    "WIN_OEM_FJ_JISHO", // [146]
    "WIN_OEM_FJ_MASSHOU", // [147]
    "WIN_OEM_FJ_TOUROKU", // [148]
    "WIN_OEM_FJ_LOYA", // [149]
    "WIN_OEM_FJ_ROYA", // [150]
    "", // [151]
    "", // [152]
    "", // [153]
    "", // [154]
    "", // [155]
    "", // [156]
    "", // [157]
    "", // [158]
    "", // [159]
    "CIRCUMFLEX", // [160]
    "EXCLAMATION", // [161]
    "DOUBLE_QUOTE", // [162]
    "HASH", // [163]
    "DOLLAR", // [164]
    "PERCENT", // [165]
    "AMPERSAND", // [166]
    "UNDERSCORE", // [167]
    "OPEN_PAREN", // [168]
    "CLOSE_PAREN", // [169]
    "ASTERISK", // [170]
    "PLUS", // [171]
    "PIPE", // [172]
    "HYPHEN_MINUS", // [173]
    "OPEN_CURLY_BRACKET", // [174]
    "CLOSE_CURLY_BRACKET", // [175]
    "TILDE", // [176]
    "", // [177]
    "", // [178]
    "", // [179]
    "", // [180]
    "VOLUME_MUTE", // [181]
    "VOLUME_DOWN", // [182]
    "VOLUME_UP", // [183]
    "", // [184]
    "", // [185]
    "SEMICOLON", // [186]
    "EQUALS", // [187]
    "COMMA", // [188]
    "MINUS", // [189]
    "PERIOD", // [190]
    "SLASH", // [191]
    "BACK_QUOTE", // [192]
    "", // [193]
    "", // [194]
    "", // [195]
    "", // [196]
    "", // [197]
    "", // [198]
    "", // [199]
    "", // [200]
    "", // [201]
    "", // [202]
    "", // [203]
    "", // [204]
    "", // [205]
    "", // [206]
    "", // [207]
    "", // [208]
    "", // [209]
    "", // [210]
    "", // [211]
    "", // [212]
    "", // [213]
    "", // [214]
    "", // [215]
    "", // [216]
    "", // [217]
    "", // [218]
    "OPEN_BRACKET", // [219]
    "BACK_SLASH", // [220]
    "CLOSE_BRACKET", // [221]
    "QUOTE", // [222]
    "", // [223]
    "META", // [224]
    "ALTGR", // [225]
    "", // [226]
    "WIN_ICO_HELP", // [227]
    "WIN_ICO_00", // [228]
    "", // [229]
    "WIN_ICO_CLEAR", // [230]
    "", // [231]
    "", // [232]
    "WIN_OEM_RESET", // [233]
    "WIN_OEM_JUMP", // [234]
    "WIN_OEM_PA1", // [235]
    "WIN_OEM_PA2", // [236]
    "WIN_OEM_PA3", // [237]
    "WIN_OEM_WSCTRL", // [238]
    "WIN_OEM_CUSEL", // [239]
    "WIN_OEM_ATTN", // [240]
    "WIN_OEM_FINISH", // [241]
    "WIN_OEM_COPY", // [242]
    "WIN_OEM_AUTO", // [243]
    "WIN_OEM_ENLW", // [244]
    "WIN_OEM_BACKTAB", // [245]
    "ATTN", // [246]
    "CRSEL", // [247]
    "EXSEL", // [248]
    "EREOF", // [249]
    "PLAY", // [250]
    "ZOOM", // [251]
    "", // [252]
    "PA1", // [253]
    "WIN_OEM_CLEAR", // [254]
    "" // [255]
  ];