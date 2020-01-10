var rows = document.getElementsByClassName("tetRow");

function Piece(fillColor, one, two, three, four) {
    this.fillColor = fillColor;
    let leftPoint;
    let rightPoint;
    let bottomPoint;
    this.startingPos = function() {
        this.currentIndex = 0;
        this.orientations = [one, two, three, four];
        leftPoint = minCol(this.orientations[this.currentIndex]);
        rightPoint = maxCol(this.orientations[this.currentIndex]);
        bottomPoint = botPoint(this.orientations[this.currentIndex]);
        //console.log(leftPoint+" "+rightPoint);
        this.rowAdjustment = 0;
        this.colAdjustment = 0;
    }

    this.startingPos();
    
    this.next = function() {
        if(this.currentIndex === 3) {
            this.currentIndex = 0;
        } else {
            this.currentIndex++;
        }
        leftPoint = minCol(this.orientations[this.currentIndex]);
        rightPoint = maxCol(this.orientations[this.currentIndex]);
        bottomPoint = botPoint(this.orientations[this.currentIndex]);
    };

    this.map = function(color = this.fillColor) {
        for(var i = 0; i < this.orientations[this.currentIndex].length; i++){
            getPoint(this.orientations[this.currentIndex][i].x + this.rowAdjustment,
                this.orientations[this.currentIndex][i].y + this.colAdjustment).style.backgroundColor = color;
        }
        //console.log(this.currentIndex);
        //console.log(this.orientations[this.currentIndex]);
    }

    this.finalize = function() {
        let rowValues = new Array;
        for(var i = 0; i < this.orientations[this.currentIndex].length; i++){
            getPoint(this.orientations[this.currentIndex][i].x + this.rowAdjustment,
                this.orientations[this.currentIndex][i].y + this.colAdjustment).setAttribute("data-value", "1");
            //console.log(getPoint(this.orientations[this.currentIndex][i].x + this.rowAdjustment,
            //    this.orientations[this.currentIndex][i].y + this.colAdjustment).getAttribute('data-value'));
            rowValues.push(this.orientations[this.currentIndex][i].x + this.rowAdjustment);
        }
        //console.log([...new Set(rowValues)]);
        let readableRows = [...new Set(rowValues)];
        checkColClear(readableRows.sort(function(a, b){return a - b}));
    }

    this.cw = function() {
        this.map("white");
        this.next();
        //console.log(this.colAdjustment);
        checkColumnValidity(this);
        //console.log(this.colAdjustment);
        this.map();
    }

    this.shiftCol = function(colChange) {
        if((colChange < 0 && leftPoint+this.colAdjustment>0) || (colChange > 0 && rightPoint + this.colAdjustment<9)){
            this.map("white");
            this.colAdjustment = this.colAdjustment + colChange;
            this.map();
        }
    }

    this.shiftRow = function(rowChange) {
        this.map("white");
        //getPoint(23, 5).setAttribute("data-value", "1");
        
        //getPoint(23, 5).style.backgroundColor = "green";
        this.rowAdjustment = this.rowAdjustment + rowChange;
        this.map(this.fillColor);
        //console.log(this.botBorder());
        if (bottomPoint + this.rowAdjustment === 23 || this.botBorder()) {
            this.finalize();
            this.startingPos();
            nextPiece();
        }
    }

    this.botBorder = function() { // how tf so you assign va;ue to div?
        for(var i = 0; i < this.orientations[this.currentIndex].length; i++){
            //console.log(this.orientations[this.currentIndex][i].x + this.rowAdjustment + 1 <= 23 && getPoint(this.orientations[this.currentIndex][i].x + this.rowAdjustment + 1,
            //    this.orientations[this.currentIndex][i].y + this.colAdjustment).getAttribute('data-value'));
            if (this.orientations[this.currentIndex][i].x + this.rowAdjustment + 1 <= 23 && getPoint(this.orientations[this.currentIndex][i].x + this.rowAdjustment + 1,
                this.orientations[this.currentIndex][i].y + this.colAdjustment).getAttribute('data-value') === '1') {
                
                return true;
            }
        }
        return false;
    }
}

function checkColumnValidity(piece) {
    for (var i = 0; i<piece.orientations[piece.currentIndex].length; i++){
        if(piece.orientations[piece.currentIndex][i].y + piece.colAdjustment >9) {
            piece.colAdjustment--;
        }
        if(piece.orientations[piece.currentIndex][i].y + piece.colAdjustment <0) {
            piece.colAdjustment++;
        }
    }
}

function Coordinate(x, y) {
    this.x = x; //x represents row (actually y axis of grid)
    this.y = y; //y represents column (actually x axis of grid)
}

function minCol(set) {
    let min = 9;
    for (var i = 0; i < set.length; i++) {
        if(set[i].y < min){
            min = set[i].y;
        }
    }
    return min;
}

function maxCol(set) {
    let max = 0;
    for (var i = 0; i < set.length; i++) {
        if(set[i].y > max){
            max = set[i].y;
        }
    }
    return max;
}

function botPoint(set) {
    let bot = 0;
    for (var i = 0; i < set.length; i++) {
        if(set[i].x > bot){
            bot = set[i].x;
        }
    }
    return bot;
}

function getPoint(r, c) { //overload this method with coordinate
    return rows[r].children[c];
}

function checkColClear(rows) {//fucky with the long -- potentially shifting down then reading where the shift was. !!!Order array from top to bot?!!!
    for(var i = 0; i<rows.length; i++) {
        //debugger;
        let clear = true;
        for(var c = 0; c<10; c++){
            if(getPoint(rows[i], c).getAttribute("data-value") === "0"){
                //console.log(rows[i] + " " +c);
                clear = false;
                break;
            }
        }
        //console.log(clear);
        //console.log("clear " + rows[i]);
        if(clear) {
            for (var z = rows[i]; z > 0; z--) {
                for (var c = 0; c<10; c++) {
                    getPoint(z, c).setAttribute("data-value", getPoint(z-1, c).getAttribute("data-value"));
                    getPoint(z, c).style.backgroundColor = getPoint(z-1, c).style.backgroundColor;
                }
            }
        }
    }
}

//pieces
var leftGun = new Piece("#3355FF",
    ([new Coordinate(1,3), new Coordinate(0,3), new Coordinate(1,4), new Coordinate(1,5)]),
    ([new Coordinate(0,4), new Coordinate(0,5), new Coordinate(1,4), new Coordinate(2,4)]),
    ([new Coordinate(1,5), new Coordinate(2,5), new Coordinate(1,4), new Coordinate(1,3)]),
    ([new Coordinate(2,4), new Coordinate(2,3), new Coordinate(1,4), new Coordinate(0,4)]));

var rightGun = new Piece("#FF9933",
    ([new Coordinate(1,3), new Coordinate(0,5), new Coordinate(1,4), new Coordinate(1,5)]),
    ([new Coordinate(0,4), new Coordinate(2,5), new Coordinate(1,4), new Coordinate(2,4)]),
    ([new Coordinate(1,5), new Coordinate(2,3), new Coordinate(1,4), new Coordinate(1,3)]),
    ([new Coordinate(2,4), new Coordinate(0,3), new Coordinate(1,4), new Coordinate(0,4)]));

var rightSnake = new Piece("#33FF55",
    ([new Coordinate(1,3), new Coordinate(0,5), new Coordinate(1,4), new Coordinate(0,4)]),
    ([new Coordinate(2,5), new Coordinate(0,4), new Coordinate(1,4), new Coordinate(1,5)]),
    ([new Coordinate(2,3), new Coordinate(1,5), new Coordinate(2,4), new Coordinate(1,4)]),
    ([new Coordinate(2,4), new Coordinate(0,3), new Coordinate(1,3), new Coordinate(1,4)]));

var leftSnake = new Piece("#FF3333",
    ([new Coordinate(1,5), new Coordinate(0,3), new Coordinate(1,4), new Coordinate(0,4)]),
    ([new Coordinate(2,4), new Coordinate(0,5), new Coordinate(1,4), new Coordinate(1,5)]),
    ([new Coordinate(2,5), new Coordinate(1,3), new Coordinate(2,4), new Coordinate(1,4)]),
    ([new Coordinate(2,3), new Coordinate(0,4), new Coordinate(1,3), new Coordinate(1,4)]));

var t = new Piece("#9933FF",
    ([new Coordinate(1,3), new Coordinate(0,4), new Coordinate(1,4), new Coordinate(1,5)]),
    ([new Coordinate(0,4), new Coordinate(1,5), new Coordinate(1,4), new Coordinate(2,4)]),
    ([new Coordinate(1,5), new Coordinate(2,4), new Coordinate(1,4), new Coordinate(1,3)]),
    ([new Coordinate(2,4), new Coordinate(1,3), new Coordinate(1,4), new Coordinate(0,4)]));

var square = new Piece("#FFFF33",
    ([new Coordinate(0,4), new Coordinate(0,5), new Coordinate(1,4), new Coordinate(1,5)]),
    ([new Coordinate(0,4), new Coordinate(0,5), new Coordinate(1,4), new Coordinate(1,5)]),
    ([new Coordinate(0,4), new Coordinate(0,5), new Coordinate(1,4), new Coordinate(1,5)]),
    ([new Coordinate(0,4), new Coordinate(0,5), new Coordinate(1,4), new Coordinate(1,5)]));

var long = new Piece("#33FFFF",
    ([new Coordinate(1,3), new Coordinate(1,6), new Coordinate(1,4), new Coordinate(1,5)]),
    ([new Coordinate(0,5), new Coordinate(3,5), new Coordinate(1,5), new Coordinate(2,5)]),
    ([new Coordinate(2,6), new Coordinate(2,5), new Coordinate(2,4), new Coordinate(2,3)]),
    ([new Coordinate(2,4), new Coordinate(3,4), new Coordinate(1,4), new Coordinate(0,4)]));

var currentPiece;
var nextThree;
var pieces = [long, square, t, rightSnake, leftSnake, leftGun, rightGun];

function init() {
    var incPieces = Array(7).fill().map((e,i)=>i++);
    incPieces = shuffle(incPieces);
    //console.log(incPieces);
    currentPiece = pieces[incPieces[6]];
    nextThree = [pieces[incPieces[0]],pieces[incPieces[1]],pieces[incPieces[2]]];
    currentPiece.map();
}

function nextPiece() {
    currentPiece = nextThree.shift();
    let repeat;
    let next;
    do { //improve this by making custom array based on contents of nextThree
        next = randPiece();
        repeat = false;
        for (var i = 0; i < nextThree.length; i++) {
            if (next === nextThree[i]) {
                repeat = true;
            }
        }
    } while(repeat);
    nextThree.push(next);
    //console.log(nextThree);
    currentPiece.map();
}

function randPiece() {
    return pieces[shuffle([0,1,2,3,4,5,6])[0]];
}

document.addEventListener("keydown", function(e) {
    if (e.key === "ArrowLeft"){
        currentPiece.shiftCol(-1);
    }
    if (e.key === "ArrowDown"){
        currentPiece.shiftRow(1);
    }
    if (e.key === "ArrowRight"){
        currentPiece.shiftCol(1);
    }
    if (e.key === "ArrowUp"){
        currentPiece.cw();
    }
});

function test1(){
    //console.log(getPoint(new Coordinate(0,0)));
    long.map();
    long.cw();
    long.finalize();
    
}
function test2(){
    init();

}
function test3(){
    console.log(1+1+1);
}

function left() {
    leftGun.shiftCol(-1);
}

function right(){
    leftGun.shiftCol(1);
}
function down(){
    leftGun.shiftRow(1);
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