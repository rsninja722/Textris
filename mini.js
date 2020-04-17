var repeatTimer=Date.now(),delayTimer=Date.now(),inputWait=0;function handleInput(){if(time-inputWait>500){switch(state){case states.title:keyPress[k.UP]&&menuUp(),keyPress[k.DOWN]&&menuDown(),keyPress[k.RIGHT]&&(menuRight(),repeatTimer=Date.now()),keyDown[k.RIGHT]&&Date.now()-repeatTimer>200&&Date.now()-delayTimer>50&&(menuRight(),delayTimer=Date.now()),keyPress[k.LEFT]&&(menuLeft(),repeatTimer=Date.now()),keyDown[k.LEFT]&&Date.now()-repeatTimer>200&&Date.now()-delayTimer>50&&(menuLeft(),delayTimer=Date.now()),(keyPress[k.SPACE]||keyPress[k.ENTER])&&menuSelect();break;case states.count:case states.playing:break;case states.end:keyPress[k.UP]&&EndMenuUp(),keyPress[k.DOWN]&&EndMenuDown(),(keyPress[k.SPACE]||keyPress[k.ENTER])&&EndMenuSelect();break;case states.paused:(keyPress[k.p]||keyPress[k.ESCAPE])&&(state=states.playing,gameTimeOffset+=time-pauseTime,delete keyPress[k.p],delete keyPress[k.ESCAPE])}}}k={a:65,b:66,c:67,d:68,e:69,f:70,g:71,h:72,i:73,j:74,k:75,l:76,m:77,n:78,o:79,p:80,q:81,r:82,s:83,t:84,u:85,v:86,w:87,x:88,y:89,z:90,0:48,1:49,2:50,3:51,4:52,5:53,6:54,7:55,8:56,9:57,BACKTICK:192,MINUS:189,EQUALS:187,OPENSQUARE:219,ENDSQUARE:221,SEMICOLON:186,SINGLEQUOTE:222,BACKSLASH:220,COMMA:188,PERIOD:190,SLASH:191,ENTER:13,BACKSPACE:8,TAB:9,CAPSLOCK:20,SHIFT:16,CONTROL:17,ALT:18,META:91,LEFTBACKSLASH:226,ESCAPE:27,HOME:36,END:35,PAGEUP:33,PAGEDOWN:34,DELETE:46,INSERT:45,PAUSE:19,UP:38,DOWN:40,LEFT:37,RIGHT:39,CONTEXT:93,SPACE:32,F1:112,F2:113,F3:114,F4:115,F5:116,F6:117,F7:118,F8:119,F9:120,F10:121,F11:122,F12:123};var keyPress=[],keyDown=[],mousePress=[],mouseDown=[],scroll=0,mousePos={x:0,y:0},preventedEvents=[!1,!1,!1];function addListenersTo(e){window.addEventListener("keydown",kdown),window.addEventListener("keyup",kup),e.addEventListener("mousedown",mdown),e.addEventListener("mouseup",mup),e.addEventListener("mousemove",mmove),e.addEventListener("contextmenu",cmenu),e.addEventListener("wheel",scrl)}function removeListenersFrom(e){window.removeEventListener("keydown",kdown),window.removeEventListener("keyup",kup),e.removeEventListener("mousedown",mdown),e.removeEventListener("mouseup",mup),e.removeEventListener("mousemove",mmove),e.removeEventListener("contextmenu",cmenu),e.removeEventListener("wheel",scrl)}function resetInput(){for(var e=0;e<keyPress.length;e++){keyPress[e]&&(keyPress[e]=0)}for(e=0;e<mousePress.length;e++){mousePress[e]&&(mousePress[e]=0)}scroll=0}function kdown(e){0===abuffer.length&&loadSounds();var n=e.keyCode;state===states.title&&27!==n&&115!==n&&80!==n&&82!==n&&bindKey(e),keyPress[n]=null==keyPress[n]?1:0,keyDown[n]=1,preventedEvents[0]&&e.preventDefault()}function kup(e){var n=e.keyCode;delete keyPress[n],delete keyDown[n]}function mdown(e){var n=e.button;mousePress[n]=null==mousePress[n]?1:0,mouseDown[n]=1,preventedEvents[1]&&e.preventDefault()}function mup(e){var n=e.button;delete mousePress[n],delete mouseDown[n]}function mmove(e){mousePos.x=e.offsetX,mousePos.y=e.offsetY}function cmenu(e){preventedEvents[1]&&e.preventDefault()}function scrl(e){scroll+=e.deltaY/100*-1,preventedEvents[2]&&e.preventDefault()}var audio=["sounds/","move.wav","rotate.wav","drop.wav","clear1.wav","clear2.wav","clear3.wav","clear4.wav","hold.wav","place.wav","spin.wav"],audioPaths=[],sounds={},abuffer=[],volumeList=[],audioLoadedLength=0,volume={sfx:1,bgm:1};const acceptableChars="qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890_-. ",AudioContext=window.AudioContext||window.webkitAudioContext;var context,sfxVolumeNode,bmgVolumeNode,countDownStart,lastNumber;function loadSounds(){var e="";context=new AudioContext,(sfxVolumeNode=context.createGain()).connect(context.destination),(bmgVolumeNode=context.createGain()).connect(context.destination),function n(t){let s="";for(let i=0;i<t.length;i++){"string"==typeof t[i]&&(0==i?(e+=t[i],s=t[i]):(audioPaths.push(e+t[i]),newSound(e+t[i]))),"object"==typeof t[i]&&n(t[i])}e=e.slice(0,e.length-s.length)}(audio),loadLoop()}function loadLoop(){audioPaths.length==audioLoadedLength?audioPaths=[]:requestAnimationFrame(loadLoop)}function newSound(e){let n,t=e.lastIndexOf(".");for(let s=t-1;acceptableChars.includes(e[s]);s--){n=s}let s=e.slice(n,t);sounds[s]={nodes:[],volNodes:[],src:e,type:"sfx",volume:1},sounds[s].nodes=[1];let i=new Audio;i.onerror=function(){console.warn(e+" was not found")},i.src=e,i.preload="auto",i.addEventListener("canplaythrough",function(){audioLoadedLength++},!1),sounds[s].nodes.push(i);let r=context.createMediaElementSource(i),o=context.createGain();r.connect(o),o.connect(sfxVolumeNode),abuffer.push(r),volumeList.push(o),sounds[s].volNodes.push(volumeList.length-1)}function addSound(e){let n=new Audio;n.src=e.src,n.preload="auto",e.nodes.splice(e.nodes[0],0,n);let t=context.createMediaElementSource(n),s=context.createGain();s.gain.value=e.volume,t.connect(s),s.connect("sfx"==e.type?sfxVolumeNode:bmgVolumeNode),abuffer.push(t),volumeList.push(s),e.volNodes.push(volumeList.length-1)}function play(e){null!=e&&(s=e.nodes,s[s[0]].ended||!s[s[0]].played.length?(s[s[0]].play(),s[0]++,s[0]==s.length&&(s[0]=1)):(addSound(e),s[s[0]].play(),s[0]++,s[0]==s.length&&(s[0]=1)))}function setVolume(e,n){for(let t=0,s=e.volNodes.length;t<s;t++){volumeList[e.volNodes[t]].gain.value=n}}function setType(e,n){for(let t=0,s=e.volNodes.length;t<s;t++){volumeList[e.volNodes[t]].disconnect("sfx"==e.type?sfxVolumeNode:bmgVolumeNode),volumeList[e.volNodes[t]].connect("sfx"==n?sfxVolumeNode:bmgVolumeNode)}e.type=n}function stop(e){s=e.nodes;for(let e=1;e<s.length;e++){s[e].pause(),s[e].currentTime=123456789}}function handleCountDown(e){e&&(game.style.letterSpacing="-4px",countDownStart=time),3+(countDownStart-time)/1e3<=0&&(play(sounds.rotate),state=states.playing,reset())}function generateCountDownText(){var e,n="\n\np or esc to pause\n\nr or f4  to reset\n\n\n\n\n\n\n                    ",t=3+(countDownStart-time)/1e3;return(e=t<1?"1":t<2?"2":"3")!==lastNumber&&play(sounds.move),lastNumber=e,n+=e}const pieces=[[[!1,!1,!1,!1],[!0,!0,!0,!0],[!1,!1,!1,!1],[!1,!1,!1,!1]],[[!1,!1,!1,!1],[!1,!0,!0,!1],[!1,!0,!0,!1],[!1,!1,!1,!1]],[[!0,!1,!1],[!0,!0,!0],[!1,!1,!1]],[[!1,!1,!0],[!0,!0,!0],[!1,!1,!1]],[[!1,!0,!0],[!0,!0,!1],[!1,!1,!1]],[[!0,!0,!1],[!1,!0,!0],[!1,!1,!1]],[[!1,!0,!1],[!0,!0,!0],[!1,!1,!1]]],pieceNames=["i","o","j","l","s","z","t"],kickTable={norm01:[[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],norm10:[[0,0],[1,0],[1,-1],[0,2],[1,2]],norm12:[[0,0],[1,0],[1,-1],[0,2],[1,2]],norm21:[[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],norm23:[[0,0],[1,0],[1,1],[0,-2],[1,-2]],norm32:[[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],norm30:[[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],norm03:[[0,0],[1,0],[1,1],[0,-2],[1,-2]],line01:[[0,0],[-2,0],[1,0],[-2,-1],[1,2]],line10:[[0,0],[2,0],[-1,0],[2,1],[-1,-2]],line12:[[0,0],[-1,0],[2,0],[-1,2],[2,-1]],line21:[[0,0],[1,0],[-2,0],[1,-2],[-2,1]],line23:[[0,0],[2,0],[-1,0],[2,1],[-1,-2]],line32:[[0,0],[-2,0],[1,0],[-2,-1],[1,2]],line30:[[0,0],[1,0],[-2,0],[1,-2],[-2,1]],line03:[[0,0],[-1,0],[2,0],[-1,2],[2,-1]]};var piece,px,py,prot,pieceName,arr=20,das=150,softDrop=20,gravity=300,placeDelay=500,keysBindings={cww:k.z,cw:k.x,hold:k.c,hardDrop:k.SPACE,softDrop:k.DOWN,left:k.LEFT,right:k.RIGHT};if(void 0!==localStorage.textris){var settings=JSON.parse(localStorage.textris);arr=settings.arr,das=settings.das,softDrop=settings.softDrop,gravity=settings.gravity,placeDelay=settings.placeDelay,keysBindings.cww=settings.keysBindings.cww,keysBindings.cw=settings.keysBindings.cw,keysBindings.hold=settings.keysBindings.hold,keysBindings.hardDrop=settings.keysBindings.hardDrop,keysBindings.softDrop=settings.keysBindings.softDrop,keysBindings.left=settings.keysBindings.left,keysBindings.right=settings.keysBindings.right}var bag=[],preview=[],previewNames=[],clears=[],animationColumns=[],linesCleared=0,lastMoveWasSpin=!1,textBuffer=[],hold={piece:void 0,pieceName:void 0,used:!1},board=(hold={left:0,right:0},[]),timers={arrl:0,arrr:0,das:0,softDrop:0,gravity:0,place:0,spin:0,dropAnimation:0,game:0},gameTimeOffset=0;function handlePlaying(e){if(frameCount%7||textBuffer.shift(),e&&(game.innerText=drawPlaying()),void 0===piece&&nextPiece(!1),keyPress[k.r]||keyPress[k.F4]){return state=states.count,0}if(keyPress[k.p]||keyPress[k.ESCAPE]){return state=states.paused,0}if(time-timers.gravity>gravity){if(colliding(piece,px,py+1)){if(time-timers.place>placeDelay){return placePiece(),play(sounds.place),piece=void 0,0}}else{++py,timers.place=time}timers.gravity=time}if(keyPress[keysBindings.hold]&&!hold.used){play(sounds.hold);var n=pieces[pieceNames.indexOf(pieceName)].slice(),t=pieceName;void 0===hold.piece?nextPiece(!1):nextPiece(!0),hold.piece=n,hold.pieceName=t,hold.used=!0}if(fillPreview(),keyPress[keysBindings.cw]){var s=piece.slice(),i=kickTable[`${"i"===pieceName?"line":"norm"}${prot}${(prot+1)%4}`];s=rotCW(s,s.length);for(var r=0;r<5;r++){if(!colliding(s,px+i[r][0],py-i[r][1])){piece=s,px+=i[r][0],py-=i[r][1],++prot,prot%=4,timers.place=time,play(sounds.rotate),lastMoveWasSpin=!0;break}}}if(keyPress[keysBindings.cww]){s=piece.slice(),i=kickTable[`${"i"===pieceName?"line":"norm"}${prot}${prot-1<0?3:prot-1}`];s=rotCWW(s,s.length);for(r=0;r<5;r++){if(!colliding(s,px+i[r][0],py-i[r][1])){piece=s,px+=i[r][0],py-=i[r][1],prot=--prot<0?3:prot,timers.place=time,play(sounds.rotate),lastMoveWasSpin=!0;break}}}if(keyPress[keysBindings.left]&&(colliding(piece,px-1,py)||(--px,timers.place=time,timers.arrl=time,play(sounds.move),lastMoveWasSpin=!1),timers.das=time),keyDown[keysBindings.left]&&time-timers.das>das){if(0==arr){for(;!colliding(piece,px-1,py);){--px,timers.place=time,lastMoveWasSpin=!1}}else{time-timers.arrl>arr&&(colliding(piece,px-1,py)||(--px,timers.place=time,play(sounds.move),lastMoveWasSpin=!1),timers.arrl=time)}}if(keyPress[keysBindings.right]&&(colliding(piece,px+1,py)||(++px,timers.place=time,timers.arrr=time,play(sounds.move),lastMoveWasSpin=!1),timers.das=time),keyDown[keysBindings.right]&&time-timers.das>das){if(0==arr){for(;!colliding(piece,px+1,py);){++px,timers.place=time,lastMoveWasSpin=!1}}else{time-timers.arrr>arr&&(colliding(piece,px+1,py)||(++px,timers.place=time,play(sounds.move),lastMoveWasSpin=!1),timers.arrr=time)}}if(keyPress[keysBindings.softDrop]&&(colliding(piece,px,py+1)||(++py,timers.softDrop=time,timers.place=time,play(sounds.move),lastMoveWasSpin=!1)),keyDown[keysBindings.softDrop]&&time-timers.softDrop>softDrop){if(0==softDrop){for(;!colliding(piece,px,py+1);){++py,timers.place=time,lastMoveWasSpin=!1}}else{time-timers.softDrop>softDrop&&(colliding(piece,px,py+1)||(++py,timers.softDrop=time,timers.place=time,play(sounds.move),lastMoveWasSpin=!1))}}if(keyPress[keysBindings.hardDrop]){animationColumns=[];for(var o=0;o<piece.length;o++){for(var a=0;a<piece[0].length;a++){piece[o][a]&&(animationColumns.includes(a+px)||animationColumns.push(a+px))}}for(timers.dropAnimation=time;!colliding(piece,px,py+1);){++py,lastMoveWasSpin=!1}play(sounds.drop),placePiece(),piece=void 0}clearCount=0;for(o=0;o<board.length;o++){var d=!0;for(a=0;a<board[0].length;a++){if(!board[o][a]){d=!1;break}}if(d&&(board.splice(o,1),board.unshift(new Array(board[0].length).fill(!1)),clears.push(o),timers.spin=time,++linesCleared,++clearCount,linesCleared>=40)){var l=(time-timers.game-gameTimeOffset)/1e3;endMessage="time: "+l,void 0===localStorage.TextrisTimes?localStorage.TextrisTimes=l+",":localStorage.TextrisTimes=localStorage.TextrisTimes+l+",",state=states.end}}if(clearCount>0){switch(play(sounds[`clear${clearCount}`]),clearCount){case 1:addToTextBuffer("single ");break;case 2:addToTextBuffer("double ");break;case 3:addToTextBuffer("triple ");break;case 4:addToTextBuffer("textris ")}}}function nextPiece(e){e?(piece=hold.piece.slice(),pieceName=hold.pieceName):(piece=preview.splice(0,1)[0],pieceName=previewNames.splice(0,1)[0]),prot=0,colliding(piece,px=4,py=1)&&(endMessage="topped out!",state=states.end)}function reset(){makeBoard(),piece=void 0,preview=[],previewNames=[],animationColumns=[],clears=[],linesCleared=0,lastMoveWasSpin=!1,textBuffer=[],bag=[0,1,2,3,4,5,6],gameTimeOffset=0,hold={piece:void 0,pieceName:void 0,used:!1},fillPreview();for(var e=Object.keys(timers),n=0;n<e.length;n++){timers[e[n]]=time}timers.game=time}function makeBoard(){board=[];for(var e=0;e<22;e++){for(var n=[],t=0;t<10;t++){n.push(!1)}board.push(n)}}function fillPreview(){for(;preview.length<5;){const e=rand(0,bag.length-1),n=bag.splice(e,1);preview.push(pieces[n].slice()),previewNames.push(pieceNames[n]),0===bag.length&&(bag=[0,1,2,3,4,5,6])}}function drawPlaying(){for(var e=[],n=0;n<22;n++){for(var t=[],s=0;s<40;s++){s>8&&s<30&&n>1&&s%2?t.push("."):t.push(" ")}e.push(t)}if(time-timers.dropAnimation<300){var i=~~((time-timers.dropAnimation)/10);i=i>19?19:i;for(var r=0;r<animationColumns.length;r++){for(s=2*animationColumns[r]+10,n=2+i;n<22;n++){e[n][s]=":",e[n][s+1]=":"}}}time-timers.spin>1e3&&(clears=[]);var o=~~((time-timers.spin+100)/((time-timers.spin)/20))%3;for(r=2;r<22;r++){var a="|";clears.includes(r)&&(a=0==o?"|":1==o?"\\":"/"),e[r][9]=a,e[r][30]=a}drawBoard(e),drawGhost(e),drawPiece(e),drawHold(e),drawPreview(e),textToBoard(e,textBuffer.slice(0,textBuffer.length<20?textBuffer.length:20).join(""),10,1),textToBoard(e,"clear "+(40-linesCleared),0,18),textToBoard(e,"time:  "+(time-timers.game-gameTimeOffset)/1e3,18,0),textToBoard(e,`${keyDown[keysBindings.cww]?"-":"#"}${keyDown[keysBindings.cw]?"-":"#"} ${keyDown[keysBindings.hold]?"-":"#"}  ${keyDown[keysBindings.hardDrop]?"-":"#"}  ${keyDown[keysBindings.left]?"-":"#"}${keyDown[keysBindings.softDrop]?"-":"#"}${keyDown[keysBindings.right]?"-":"#"}`,0,0);var d="";for(n=0;n<e.length;n++){line="";for(s=0;s<e[0].length;s++){line+=e[n][s]}d+=line+"\n"}return d}function addToTextBuffer(e){var n=textBuffer.join("");n.length<18&&(e="".padStart(18-n.length," ")+e);var t=e.split("");for(let e=0;e<t.length;e++){textBuffer.push(t[e])}}function textToBoard(e,n,t,s){for(var i=0;i<n.length;i++){e[s][t+i]=n[i]}}function drawBoard(e){for(var n=2;n<board.length;n++){for(var t=0;t<board[0].length;t++){if(board[n][t]){const s=2*t+10;e[n][s]="[",e[n][s+1]="]"}}}}function drawGhost(e){if(void 0!==piece){for(var n=piece.slice(),t=py;!colliding(n,px,t+1);){++t}for(var s=0;s<piece.length;s++){for(var i=0;i<piece[0].length;i++){if(piece[s][i]){const n=2*px+2*i+10,r=t+s;r>1&&(e[r][n]="(",e[r][n+1]=")")}}}}}function drawPiece(e){if(void 0!==piece){for(var n=0;n<piece.length;n++){for(var t=0;t<piece[0].length;t++){if(piece[n][t]){const s=2*px+2*t+10,i=py+n;i>1&&(e[i][s]="[",e[i][s+1]="]")}}}}}function drawHold(e){if(void 0!==hold.piece){for(var n=0;n<hold.piece.length;n++){for(var t=0;t<hold.piece[0].length;t++){if(hold.piece[n][t]){const s=2*t,i=n+2;e[i][s]="[",e[i][s+1]="]"}}}}}function drawPreview(e){for(var n=0;n<preview.length;n++){const i=preview[n];for(var t=0;t<i.length;t++){for(var s=0;s<i[0].length;s++){if(i[t][s]){const i=32+2*s,r=2+t+4*n;e[r][i]="[",e[r][i+1]="]"}}}}}function rand(e,n){return Math.floor(Math.random()*(n-e+1))+e}function rotCW(e,n){for(var t=new Array(n),s=0;s<n;s++){t[s]=new Array(n).fill(!1)}for(s=0;s<n;++s){for(var i=0;i<n;++i){t[s][i]=e[n-i-1][s]}}return t}function rotCWW(e,n){for(var t=new Array(n),s=0;s<n;s++){t[s]=new Array(n).fill(!1)}for(s=0;s<n;++s){for(var i=0;i<n;++i){t[s][i]=e[i][n-s-1]}}return t}function colliding(e,n,t){const s=e.length,i=board.length-1,r=board[0].length-1;for(var o=t,a=t+s;o<a;o++){for(var d=n,l=n+s;d<l;d++){if(e[o-t][d-n]){if(d<0||o<0||o>i||d>r){return!0}if(board[o][d]){return!0}}}}return!1}function placePiece(){if("t"===pieceName&&!0===lastMoveWasSpin){var e=0;-1!==px?board[py][px]&&++e:e++,px+2<board[0].length?board[py][px+2]&&++e:++e,py+2<board.length&&-1!==px?board[py+2][px]&&++e:++e,px+2<board[0].length&&py+2<board.length?board[py+2][px+2]&&++e:++e,e>=3&&(play(sounds.spin),addToTextBuffer("t spin "))}for(var n=0;n<piece.length;n++){for(var t=0;t<piece[0].length;t++){piece[n][t]&&(board[py+n][px+t]=piece[n][t])}}hold.used=!1}const UI=[["play","options","exit"],["save and return to menu","sfx","left","right","cw","ccw","hold","hard","soft","das","arr","soft speed","gravity","place delay"]],optionTypes=["none","slider","key","key","key","key","key","key","key","slider","slider","slider","slider","slider"],sliderMaxCur=[[0,0],[200,100],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[200,das],[100,arr],[100,softDrop],[1e3,gravity],[1e3,placeDelay]];var UIIndex=0,curMenu=0,listeningForBind=!1,timeOut=0,personalTimes="";function handleTitle(e){if(e&&void 0!==localStorage.TextrisTimes){var n=localStorage.TextrisTimes.split(",");n.pop();for(var t=0;t<n.length;t++){n[t]=parseFloat(n[t])}n.sort(function(e,n){return e>n?1:n>e?-1:0});var s="\npersonal times\n\n";for(t=0;t<n.length;t++){s+=n[t]+"\n"}personalTimes=s}}function menuUp(){UIIndex>0?--UIIndex:UIIndex=UI[curMenu].length-1,play(sounds.move)}function menuDown(){UIIndex<UI[curMenu].length-1?++UIIndex:UIIndex=0,play(sounds.move)}function menuRight(){1===curMenu&&"slider"===optionTypes[UIIndex]&&sliderMaxCur[UIIndex][1]<sliderMaxCur[UIIndex][0]&&(sliderMaxCur[UIIndex][1]+=10,specificAction())}function menuLeft(){1===curMenu&&"slider"===optionTypes[UIIndex]&&sliderMaxCur[UIIndex][1]>0&&(sliderMaxCur[UIIndex][1]-=10,specificAction())}function specificAction(){1===UIIndex&&(sfxVolumeNode.gain.value=sliderMaxCur[1][1]/100),9===UIIndex&&(das=sliderMaxCur[9][1]),10===UIIndex&&(arr=sliderMaxCur[10][1]),11===UIIndex&&(softDrop=sliderMaxCur[11][1]),12===UIIndex&&(gravity=sliderMaxCur[12][1]),13===UIIndex&&(placeDelay=sliderMaxCur[13][1]),play(sounds.move)}function menuSelect(){var e=UI[curMenu][UIIndex];"play"===e&&(state=states.count),"options"===e&&(UIIndex=0,curMenu=1),"save and return to menu"===e&&(UIIndex=0,curMenu=0,saveSettings()),"exit"===e&&window.location.replace("https://rsninja.dev/index.html"),1===curMenu&&"key"===optionTypes[UIIndex]&&Date.now()-timeOut>200&&(listeningForBind=!0)}function bindKey(e){if(listeningForBind){switch(UIIndex){case 2:keysBindings.left=e.keyCode;break;case 3:keysBindings.right=e.keyCode;break;case 4:keysBindings.cw=e.keyCode;break;case 5:keysBindings.cww=e.keyCode;break;case 6:keysBindings.hold=e.keyCode;break;case 7:keysBindings.hardDrop=e.keyCode;break;case 8:keysBindings.softDrop=e.keyCode}timeOut=Date.now(),listeningForBind=!1}}function saveSettings(){var e={};e.sfx=sliderMaxCur[1][1],e.das=sliderMaxCur[9][1],e.arr=sliderMaxCur[10][1],e.softDrop=sliderMaxCur[11][1],e.gravity=sliderMaxCur[12][1],e.placeDelay=sliderMaxCur[13][1],e.keysBindings={cww:keysBindings.cww,cw:keysBindings.cw,hold:keysBindings.hold,hardDrop:keysBindings.hardDrop,softDrop:keysBindings.softDrop,left:keysBindings.left,right:keysBindings.right},localStorage.textris=JSON.stringify(e)}function generateMenu(){for(var e=0===curMenu?"Textris\n\narrow keys to navigate\nspace to select\n___________________________\n\n":"Options\n___________________________\n\n",n=UI[curMenu],t=0;t<n.length;t++){e+=n[t],e+="slider"===optionTypes[t]&&1===curMenu?generateSlider(t):"",e+="key"===optionTypes[t]&&1===curMenu?" "+generateKey(t):"",e+=(~~(frameCount/20)%2&&UIIndex===t?"_":"")+"\n\n"}return e+=0===curMenu?personalTimes:""}function generateKey(e){if(e===UIIndex&&!0===listeningForBind){return"press any key"}switch(e){case 2:return keyboardMap[keysBindings.left];case 3:return keyboardMap[keysBindings.right];case 4:return keyboardMap[keysBindings.cw];case 5:return keyboardMap[keysBindings.cww];case 6:return keyboardMap[keysBindings.hold];case 7:return keyboardMap[keysBindings.hardDrop];case 8:return keyboardMap[keysBindings.softDrop]}}function generateSlider(e){var n=sliderMaxCur[e][0]/10,t=sliderMaxCur[e][1]/10;100===n&&(n/=10,t/=10);var s="";s+=" <";for(var i=0;i<t;i++){s+="="}for(i=0;i<n-t;i++){s+="-"}return s+="> ",10!==e&&11!==e||0!==sliderMaxCur[e][1]?s+=sliderMaxCur[e][1]:s+="instant",s}var inputDelay,keyboardMap=["","","","CANCEL","","","HELP","","BACK_SPACE","TAB","","","CLEAR","ENTER","ENTER_SPECIAL","","SHIFT","CONTROL","ALT","PAUSE","CAPS_LOCK","KANA","EISU","JUNJA","FINAL","HANJA","","ESCAPE","CONVERT","NONCONVERT","ACCEPT","MODECHANGE","SPACE","PAGE_UP","PAGE_DOWN","END","HOME","LEFT","UP","RIGHT","DOWN","SELECT","PRINT","EXECUTE","PRINTSCREEN","INSERT","DELETE","","0","1","2","3","4","5","6","7","8","9","COLON","SEMICOLON","LESS_THAN","EQUALS","GREATER_THAN","QUESTION_MARK","AT","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","OS_KEY","","CONTEXT_MENU","","SLEEP","NUMPAD0","NUMPAD1","NUMPAD2","NUMPAD3","NUMPAD4","NUMPAD5","NUMPAD6","NUMPAD7","NUMPAD8","NUMPAD9","MULTIPLY","ADD","SEPARATOR","SUBTRACT","DECIMAL","DIVIDE","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12","F13","F14","F15","F16","F17","F18","F19","F20","F21","F22","F23","F24","","","","","","","","","NUM_LOCK","SCROLL_LOCK","WIN_OEM_FJ_JISHO","WIN_OEM_FJ_MASSHOU","WIN_OEM_FJ_TOUROKU","WIN_OEM_FJ_LOYA","WIN_OEM_FJ_ROYA","","","","","","","","","","CIRCUMFLEX","EXCLAMATION","DOUBLE_QUOTE","HASH","DOLLAR","PERCENT","AMPERSAND","UNDERSCORE","OPEN_PAREN","CLOSE_PAREN","ASTERISK","PLUS","PIPE","HYPHEN_MINUS","OPEN_CURLY_BRACKET","CLOSE_CURLY_BRACKET","TILDE","","","","","VOLUME_MUTE","VOLUME_DOWN","VOLUME_UP","","","SEMICOLON","EQUALS","COMMA","MINUS","PERIOD","SLASH","BACK_QUOTE","","","","","","","","","","","","","","","","","","","","","","","","","","","OPEN_BRACKET","BACK_SLASH","CLOSE_BRACKET","QUOTE","","META","ALTGR","","WIN_ICO_HELP","WIN_ICO_00","","WIN_ICO_CLEAR","","","WIN_OEM_RESET","WIN_OEM_JUMP","WIN_OEM_PA1","WIN_OEM_PA2","WIN_OEM_PA3","WIN_OEM_WSCTRL","WIN_OEM_CUSEL","WIN_OEM_ATTN","WIN_OEM_FINISH","WIN_OEM_COPY","WIN_OEM_AUTO","WIN_OEM_ENLW","WIN_OEM_BACKTAB","ATTN","CRSEL","EXSEL","EREOF","PLAY","ZOOM","","PA1","WIN_OEM_CLEAR",""],endMessage="";const endUI=["play again","main menu"];var pauseTime,EndUIIndex=0;function EndMenuUp(){EndUIIndex>0?--EndUIIndex:EndUIIndex=endUI.length-1,play(sounds.move)}function EndMenuDown(){EndUIIndex<endUI.length-1?++EndUIIndex:EndUIIndex=0,play(sounds.move)}function EndMenuSelect(){var e=endUI[EndUIIndex];"play again"===e&&(state=states.count),"main menu"===e&&(state=states.title)}function handleEnd(e){e&&(game.style.letterSpacing="",inputWait=time)}function drawEnd(){var e="";e+=endMessage+"\n\n";for(var n=0;n<endUI.length;n++){e+=endUI[n],e+=(~~(frameCount/20)%2&&EndUIIndex===n?"_":"")+"\n\n"}return e}function drawPause(){return"paused\n\npress p or ESC to resume"}function handlePause(e){e&&(inputWait=time,pauseTime=time)}var time,lastState,game=document.getElementById("game"),states={title:0,count:1,playing:2,end:3,paused:4},state=states.title,frameCount=0;function draw(){switch(game.innerText="",state){case states.title:game.innerText=generateMenu();break;case states.count:game.innerText=generateCountDownText();break;case states.playing:game.innerText=drawPlaying();break;case states.end:game.innerText=drawEnd();break;case states.paused:game.innerText=drawPause()}requestAnimationFrame(draw)}function updateLoop(){time=Date.now(),handleInput();var e=!1;switch(state!==lastState&&(e=!0),lastState=state,state){case states.title:handleTitle(e);break;case states.count:handleCountDown(e);break;case states.playing:handlePlaying(e);break;case states.end:handleEnd(e);break;case states.paused:handlePause(e)}resetInput(),++frameCount}addListenersTo(document.body),setInterval(updateLoop,10),requestAnimationFrame(draw);