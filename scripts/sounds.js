var audio = [
    "sounds/",
    "move.wav",
    "rotate.wav",
    "drop.wav",
    "clear1.wav",
    "clear2.wav",
    "clear3.wav",
    "clear4.wav",
    "hold.wav",
    "place.wav",
    "spin.wav"
],
    audioPaths = [],
    sounds = {}, // loaded sounds
    abuffer = [], // audio nodes shoved here
    volumeList = [], // gain nodes shoved here
    audioLoadedLength = 0,
    volume = { sfx: 1, bgm: 1 };

const acceptableChars = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890_-. ";

const AudioContext = window.AudioContext || window.webkitAudioContext;
var context;
var sfxVolumeNode;
var bmgVolumeNode;

function loadSounds() {
    var curpath = "";
    context = new AudioContext();
    sfxVolumeNode = context.createGain();
    sfxVolumeNode.connect(context.destination);
    bmgVolumeNode = context.createGain();
    bmgVolumeNode.connect(context.destination);
    deeper(audio, "sound");
    function deeper(curpos) {
        let addedPath = "";
        for (let j = 0; j < curpos.length; j++) {
            if (typeof curpos[j] == "string") {
                if (j == 0) {
                    curpath += curpos[j];
                    addedPath = curpos[j];
                } else {
                    audioPaths.push(curpath + curpos[j]);
                    newSound(curpath + curpos[j]);
                }
            }
            if (typeof curpos[j] == "object") {
                deeper(curpos[j]);
            }
        }
        curpath = curpath.slice(0, curpath.length - addedPath.length);
    }
    loadLoop();
}

function loadLoop() {
    if (audioPaths.length == audioLoadedLength) {
        audioPaths = [];
    } else {
        requestAnimationFrame(loadLoop);
    }
}

function newSound(src) {
    let startpos;
    let endpos = src.lastIndexOf(".");
    for (let j = endpos - 1; acceptableChars.includes(src[j]); j--) { startpos = j; }
    let soundName = src.slice(startpos, endpos);
    sounds[soundName] = { nodes: [], volNodes: [], src: src, type: "sfx", volume: 1 };
    sounds[soundName].nodes = [1];

    let loadingSound = new Audio();
    loadingSound.onerror = function () {
        console.warn(src + " was not found");
    };
    loadingSound.src = src;
    loadingSound.preload = 'auto';
    loadingSound.addEventListener('canplaythrough', function () {
        audioLoadedLength++;
    }, false);
    sounds[soundName].nodes.push(loadingSound);

    let soundNode = context.createMediaElementSource(loadingSound);
    let gainNode = context.createGain();

    soundNode.connect(gainNode);
    gainNode.connect(sfxVolumeNode);

    abuffer.push(soundNode);
    volumeList.push(gainNode);
    sounds[soundName].volNodes.push(volumeList.length - 1);
}

function addSound(sound) {
    let loadingSound = new Audio();
    loadingSound.src = sound.src;
    loadingSound.preload = 'auto';
    sound.nodes.splice(sound.nodes[0], 0, loadingSound);

    let soundNode = context.createMediaElementSource(loadingSound);
    let gainNode = context.createGain();
    gainNode.gain.value = sound.volume;

    soundNode.connect(gainNode);
    gainNode.connect(sound.type == "sfx" ? sfxVolumeNode : bmgVolumeNode);

    abuffer.push(soundNode);
    volumeList.push(gainNode);
    sound.volNodes.push(volumeList.length - 1);
}



function play(sound) {
    if (sound != undefined) {
        s = sound.nodes;
        if (s[s[0]].ended || !(s[s[0]].played.length)) {
            s[s[0]].play();
            s[0]++;
            if (s[0] == s.length) {
                s[0] = 1;
            }
        } else {
            addSound(sound);
            s[s[0]].play();
            s[0]++;
            if (s[0] == s.length) {
                s[0] = 1;
            }
        }
    }
}

function setVolume(sound, volume) {
    for (let i = 0, l = sound.volNodes.length; i < l; i++) {
        volumeList[sound.volNodes[i]].gain.value = volume;
    }
}

function setType(sound, newType) {
    for (let i = 0, l = sound.volNodes.length; i < l; i++) {
        volumeList[sound.volNodes[i]].disconnect(sound.type == "sfx" ? sfxVolumeNode : bmgVolumeNode);
        volumeList[sound.volNodes[i]].connect(newType == "sfx" ? sfxVolumeNode : bmgVolumeNode);
    }
    sound.type = newType;
}

function stop(sound) {
    s = sound.nodes;
    for (let i = 1; i < s.length; i++) {
        s[i].pause();
        s[i].currentTime = 123456789; // this will not end the sound if it is longer than 3.9 years
    }
}