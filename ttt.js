//MAKE TIE
var isX = true;
var current = "x";
var buttons = document.getElementsByClassName("tttButton");

function toggle(button) {
    if (isX){
        document.getElementById(button).innerHTML = "X";
        document.getElementById(button).value = "x";
        document.getElementById(button).style.backgroundColor = "#99FFCC";
        document.getElementById("currentText").innerHTML = "current turn: o";
    }
    if (!isX){
        document.getElementById(button).innerHTML = "O";
        document.getElementById(button).value = "o";
        document.getElementById(button).style.backgroundColor = "#FFB3BF";
        document.getElementById("currentText").innerHTML = "current turn: x";
    }
    document.getElementById(button).disabled = true;
    isX = !isX;
    checkWin();
}

function reset() {
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = false;
        buttons[i].innerHTML = "";
        buttons[i].value = i;
        buttons[i].style.backgroundColor = "#DEDEDE";
    }
    isX = true;
    document.getElementById("currentText").innerHTML = "current turn: x";
}

function checkWin(){
    //row
    if (buttons[0].value === buttons[1].value && buttons[0].value === buttons[2].value) {
        //document.getElementById("test").innerHTML = "top row win";
        win(buttons[0].value);
    }
    if (buttons[3].value === buttons[4].value && buttons[3].value === buttons[5].value) {
        //document.getElementById("test").innerHTML = "middle row win";
        win(buttons[3].value);
    }
    if (buttons[6].value === buttons[7].value && buttons[6].value === buttons[8].value) {
        //document.getElementById("test").innerHTML = "bottom row win";
        win(buttons[6].value);
    }

    //col
    if (buttons[0].value === buttons[3].value && buttons[0].value === buttons[6].value) {
        //document.getElementById("test").innerHTML = "left col win";
        win(buttons[0].value);
    }
    if (buttons[1].value === buttons[4].value && buttons[1].value === buttons[7].value) {
        //document.getElementById("test").innerHTML = "middle col win";
        win(buttons[1].value);
    }
    if (buttons[2].value === buttons[5].value && buttons[2].value === buttons[8].value) {
        //document.getElementById("test").innerHTML = "right col win";
        win(buttons[2].value);
    }

    //diag
    if (buttons[0].value === buttons[4].value && buttons[0].value === buttons[8].value) {
        //document.getElementById("test").innerHTML = "upper left diag win";
        win(buttons[0].value);
    }
    if (buttons[2].value === buttons[4].value && buttons[2].value === buttons[6].value) {
        //document.getElementById("test").innerHTML = "upper right diag win";
        win(buttons[2].value);
    }
}

function win(letter){
    document.getElementById("currentText").innerHTML = letter + " win";
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }
}