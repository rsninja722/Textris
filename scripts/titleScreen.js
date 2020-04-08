const UI = {
    mainUI: [
        "play",
        "options(wip)"
    ],
    options: [
        "sfx",
    ]
};

var UIIndex = 0;
var curMenu = "mainUI";

function menuUp() {
    if (UIIndex > 0) {
        --UIIndex;
    }
}

function menuDown() {
    if (UIIndex < UI[curMenu].length - 1) {
        ++UIIndex;
    }
}

function menuSelect() {
    var selection = UI[curMenu][UIIndex];
    if (selection === "play") {
        state = states.count;
    }
}

function generateMenu() {
    var txt = "Textris\narrow keys to navigate, space to select\n\ntemp controls: z,x,c,space,left,right,down\n\n";
    var tempMenu = UI[curMenu];
    for (var i = 0; i < tempMenu.length; i++) {
        txt += tempMenu[i] + (~~(frameCount / 20) % 2 && UIIndex === i ? "_" : "") + "\n\n";
    }
    return txt;
}