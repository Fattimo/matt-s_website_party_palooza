//LAYER AN IMAGE OVER INCORRECT FLAGS
var eButtons;
var mines = 0;
var diff = "";
var game;
var lclicked = false;
var rclicked = false;
var upperCol = 0;
var upperRow = 0;
var doubleClick = false;
var time = 0;
var timeTracker;
var trackActive = false;

function initialize(difficulty) {
    document.getElementById("start-buttons").style.display = "none";
    document.getElementById("msw-info").style.display = "block";
    document.getElementById("change-diff").style.display = "block";
    //debugger;
    switch(difficulty) {
        case "0":
            document.getElementById("eshell").style.display="block";
            document.getElementById("minesleft").style.width="195px";
            document.getElementById("winlose").style.width="195px";
            game = document.getElementById("easy-board");
            eButtons = document.getElementsByClassName("easy-button");
            diff = "0";
            setBorders();
            initE(81, 10, 9, 9);
            break;
        case "1":
            document.getElementById("ishell").style.display="block";
            document.getElementById("minesleft").style.width="195px";
            document.getElementById("winlose").style.width="195px";
            game = document.getElementById("intermediate-board");
            eButtons = document.getElementsByClassName("intermediate-button");
            diff = "1";
            setBorders();
            initE(256, 40, 16, 16);
            break;
        case "2":
            document.getElementById("hshell").style.display="block";
            document.getElementById("minesleft").style.width="390px";
            document.getElementById("winlose").style.width="390px";
            game = document.getElementById("hard-board");
            eButtons = document.getElementsByClassName("hard-button");
            diff = "2";
            setBorders();
            initE(480, 99, 16, 30);
            break;
    }
    document.getElementById("winlose").innerHTML = "0";
    time = 0;
}

function timer() {
    time++;
    document.getElementById("winlose").innerHTML=time;
}

function setBorders() {
    switch(diff){
        case "0":
            upperCol = 9;
            upperRow = 9;
            break;
        case "1":
            upperCol = 16;
            upperRow = 16;
            break;
        case "2":
            upperCol = 30;
            upperRow = 16;
            break;
    }
}

//easy
function initE(tiles, mineCt, r, c) {
    //document.getElementById("initialize").style.backgroundColor = "#FFB3BF";
    var mineLocations = Array(tiles).fill().map((e,i)=>i++);
    //console.log(mineLocations);
    mineLocations = shuffle(mineLocations);

    for(var i = 0; i < eButtons.length; i++){
        eButtons[i].id = i;
    }

    for(var i = 0; i < mineCt; i++){
        //eButtons[mineLocations[i]].innerHTML = "🚩";
        //console.log(eButtons);
        //console.log(mineLocations[i]);
        eButtons[mineLocations[i]].value = "-1";
        //test(mineLocations[i] % 9);
        setMarkers(Math.floor(mineLocations[i]/c), mineLocations[i] % c);
        mines++;
    }

    document.getElementById("minesleft").innerHTML = "mines left: " + mines;
    document.getElementById("mswshell").style.paddingTop = "15px";
}

//event delegation
//document.addEventListener("click", click, false);
document.addEventListener("contextmenu", disableContextMenu, false);

document.addEventListener("mousedown", function (e) {
    if (e.which == 1) {
        lclicked = true;
        //console.log("l");
    } else if (e.which == 3) {
        rclicked = true;
        //console.log("r");
    }
    //console.log(e.target.className);

    if (lclicked && rclicked){
        if (e.target.className === "easy-button" || e.target.className === "intermediate-button" || e.target.className === "hard-button") {
            //console.log("yes");
            doubleHold(e.target);
            game.rows[Math.floor(parseInt(e.target.id)/upperCol)].cells[parseInt(e.target.id) % upperCol].firstChild.style.backgroundColor = "#DEDEDE";
            doubleClick = true;
        }
    } else {
        doubleClick = false;
    }
});

document.addEventListener("mouseup", function (e) {
    if (e.which == 1) {
        if (lclicked && rclicked){
            //console.log("up");
            doubleRelease(e.target);
            
        } else if (!doubleClick) {
            //console.log(lclicked +""+ rclicked);
            click(e);
        }
        lclicked = false;
        //doubleClick = false;

    } else if (e.which == 3) {
        e.preventDefault();
        if (lclicked && rclicked){
            //console.log("up");
            doubleRelease(e.target);
        } else if(!doubleClick){
            //console.log(lclicked +""+ rclicked);
            rclick(e);
        }
        rclicked = false;
    }
    lclicked = false;
    rclicked = false;
});

function doubleHold(target) {
    let r = Math.floor(parseInt(target.id)/upperCol);
    let c = parseInt(target.id) % upperCol;
    surroundHelper(r, c, function(r, c){
        if(game.rows[r].cells[c].firstChild.innerHTML != "🚩") {
            game.rows[r].cells[c].firstChild.style.backgroundColor = "#DEDEDE";
        }
    });
}

function doubleRelease(target) {
    //console.log("yes");
    let r = Math.floor(parseInt(target.id)/upperCol);
    let c = parseInt(target.id) % upperCol;

    if(game.rows[r].cells[c].firstChild.dataset.disabled === "0") {
        game.rows[r].cells[c].firstChild.style.backgroundColor = "#EDEDED";
    } else if(checkCorrect(r, c)) {
        //console.log("true");
        sweepAdj(r, c);
    }
    
    surroundHelper(r, c, function(r, c) {
        if (game.rows[r].cells[c].firstChild.innerHTML != "🚩"){
            if(game.rows[r].cells[c].firstChild.dataset.disabled === "0") {
                game.rows[r].cells[c].firstChild.style.backgroundColor = "#EDEDED";
            }
        }
    });
}

function checkCorrect(r, c) {
    let surrMines = 0;

    surroundHelper(r, c, function(r, c){
        if (game.rows[r].cells[c].firstChild.innerHTML === "🚩"){
            surrMines++;
        }
    });
    if(surrMines === parseInt(game.rows[r].cells[c].firstChild.value, 10)){
        return true;
    }
    return false;
}

function sweepAdj(r, c) {
    //make sure the mines are valid, else lose
    let correct = true

    surroundHelper(r, c, function(r, c) {
        if (game.rows[r].cells[c].firstChild.innerHTML === "🚩"){
            if(game.rows[r].cells[c].firstChild.value >= 0) {
                correct = false;
                lose(game.rows[r].cells[c].firstChild);
            } 
        }
    });

    if(correct) {
        revealAdj(r, c);
    }
}

function click(event) {
    let target = event.target;
    
    if (target.innerHTML != "🚩" && (target.className === "easy-button" || target.className === "intermediate-button" || target.className === "hard-button")) {
        //console.log(target.dataset.disabled);
        if(!trackActive){
            timeTracker = setInterval(timer, 1000);
            trackActive = true;
        }
        reveal(target);
        //test(target.value);
        checkWin();
    }
}

function reveal(target) {
    if (target.value > 0) {
        //target.disabled = true;
        target.dataset.disabled = "1";
        target.style.backgroundColor = "#DEDEDE";
        //console.log(target.dataset.disabled);
        target.innerHTML = target.value;
    } else if (target.value === "0") {
        //test(target.id);
        revealAdj(Math.floor(parseInt(target.id)/upperCol), parseInt(target.id) % upperCol);
    } else if (target.value < 0) {
        lose(target);
    }
}

function revealAdj(r, c) {
    //game.rows[r].cells[c].firstChild.disabled = true;
    game.rows[r].cells[c].firstChild.dataset.disabled = "1";
    game.rows[r].cells[c].firstChild.style.backgroundColor = "#DEDEDE";

    surroundHelper(r,c, function(r,c){
        if (game.rows[r].cells[c].firstChild.dataset.disabled != "1") {
            if (game.rows[r].cells[c].firstChild.value === "0") {
                revealAdj(r, c);
            } else if (game.rows[r].cells[c].firstChild.value > 0) {
                game.rows[r].cells[c].firstChild.innerHTML = game.rows[r].cells[c].firstChild.value;
                //game.rows[r-1].cells[c-1].firstChild.style.fontFamily = "Comic Sans MS, cursive, sans-serif";
                //game.rows[r-1].cells[c-1].firstChild.disabled=true;
                game.rows[r].cells[c].firstChild.dataset.disabled = "1";
                game.rows[r].cells[c].firstChild.style.backgroundColor = "#DEDEDE";
            }
        }
    });
}

function rclick(event) {
    let target = event.target;

    if ((target.className === "easy-button" || target.className === "intermediate-button" || target.className === "hard-button") && target.dataset.disabled === "0") {
        mark(target);
        //test();
        //event.preventDefault();
        checkWin();
    }
}

function disableContextMenu(event) {
    let target = event.target;
    if (target.className === "easy-button" || target.className === "intermediate-button" || target.className === "hard-button") {
        event.preventDefault();
    }
}

function mark(target) {
    if (target.innerHTML === "🚩"){
        target.innerHTML = "";
        mines++;
    } else {
        target.innerHTML = "🚩";
        mines--;
    }
    document.getElementById("minesleft").innerHTML = "mines left: " + mines;
}

function test(num){
    alert(num);
}

//add one to surroundings
function setMarkers(r, c) { //make a helper func and difficulty toggles
    surroundHelper(r, c, function(r,c){
        if (parseInt(game.rows[r].cells[c].firstChild.value, 10) >= 0){
            game.rows[r].cells[c].firstChild.value = parseInt(game.rows[r].cells[c].firstChild.value, 10) + 1;
            //game.rows[r].cells[c].firstChild.innerHTML = game.rows[r].cells[c].firstChild.value;
            
            switch(game.rows[r].cells[c].firstChild.value){
                case "1":
                    //console.log("y");
                    game.rows[r].cells[c].firstChild.style.color = "#3333FF";
                    break;
                case "2":
                    game.rows[r].cells[c].firstChild.style.color = "#009900";
                    break;
                case "3":
                    game.rows[r].cells[c].firstChild.style.color = "#CC0000";
                    break;
                case "4":
                    game.rows[r].cells[c].firstChild.style.color = "#000099";
                    break;
                case "5":
                    game.rows[r].cells[c].firstChild.style.color = "#801500";
                    break;
                case "6":
                    game.rows[r].cells[c].firstChild.style.color = "#00B395";
                    break;
                case "7":
                    game.rows[r].cells[c].firstChild.style.color = "#262626";
                    break;
                case "8":
                    game.rows[r].cells[c].firstChild.style.color = "#696969";
                    break;
            }
        }
    });    
}

function surroundHelper(r, c, func) {
    if (r - 1 >= 0 && c - 1 >= 0){
        func(r-1, c-1);
    }
    if (r - 1 >= 0){
        func(r-1, c);
    }
    if (r - 1 >= 0 && c + 1 < upperCol){
        func(r-1, c+1);
    }
    if (c - 1 >= 0){
        func(r, c-1);
    }
    if (c + 1 < upperCol){
        func(r, c+1);
    }
    if (r + 1 < upperRow && c - 1 >= 0){
        func(r+1, c-1);
    }
    if (r + 1 < upperRow){
        func(r+1, c);
    }
    if (r + 1 < upperRow && c + 1 < upperCol){
        func(r+1, c+1);
    }
}



function reset() {
    for (var i = 0; i < eButtons.length; i++) {
        eButtons[i].innerHTML = "";
        eButtons[i].value = "0";
        eButtons[i].disabled = false;
        eButtons[i].style.backgroundColor = "#EDEDED";
        eButtons[i].dataset.disabled = "0";
    }
    mines=0;
    //debugger;
    //console.log(diff);
    initialize(diff);
    document.getElementById("winlose").innerHTML = "0";
    clearInterval(timeTracker);
    trackActive = false;
}

function lose(target){
    clearInterval(timeTracker);
    trackActive = false;
    document.getElementById("winlose").innerHTML = "you lose";
    for(var i = 0; i < eButtons.length; i++){
        if(eButtons[i].value < 0 && eButtons[i].innerHTML!="🚩") {
            eButtons[i].innerHTML = "💣";
        }/* else if (eButtons[i].value > 0) {
            eButtons[i].innerHTML = eButtons[i].value;
        }
        eButtons[i].style.backgroundColor = "#DEDEDE"*/
        eButtons[i].disabled = true;
    }
    target.style.backgroundColor = "#FF3333";
}

function checkWin(){ //fix this
    let win = true;
    
    if (mines === 0) {
        for(var i = 0; i < eButtons.length; i++){
            if(eButtons[i].innerHTML === "🚩" && eButtons[i].value >= 0) {
                win=false;
            }
        }
    } else {
        win = false;
    }
    
    if (win){
        clearInterval(timeTracker);
        trackActive = false;
        for(var i = 0; i < eButtons.length; i++){
            eButtons[i].disabled = true;
            if (eButtons[i].value > 0) {
                eButtons[i].innerHTML = eButtons[i].value;
                eButtons[i].style.backgroundColor = "#DEDEDE";
            }
        }
        document.getElementById("winlose").innerHTML = "you win: " + time;
    }
}

function startpage(){
    for (var i = 0; i < eButtons.length; i++) {
        eButtons[i].innerHTML = "";
        eButtons[i].value = "0";
        eButtons[i].disabled = false;
        eButtons[i].dataset.disabled = "0";
        eButtons[i].style.backgroundColor = "#EDEDED";
    }
    mines=0;
    document.getElementById("start-buttons").style.display = "block";
    document.getElementById("msw-info").style.display = "none";
    document.getElementById("change-diff").style.display = "none";
    document.getElementById("eshell").style.display = "none";
    document.getElementById("ishell").style.display = "none";
    document.getElementById("hshell").style.display = "none";
    document.getElementById("mswshell").style.paddingTop = "0px";
}

//shuffle
//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array/2450976#2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}