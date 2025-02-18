var board=[];
var rows=8;
var columns=8;
var minesCount=5;
var minesLocation=[];//coordinates of mines
var tilesClicked=0;//goal is to click all tiles except the ones containing mines
var flagEnabled =false;
var gameOver=false;
var timer;
var seconds=0;
var flag = true;
window.onload=function(){
    startGame();
    document.getElementById("reset-button").addEventListener("click", resetGame);
}
function setMines(){
    
    let minesLeft = minesCount;
    while(minesLeft>0){
        let r = Math.floor(Math.random()*rows);
        let c = Math.floor(Math.random()*columns);
        let id = r.toString()+"-"+c.toString();

        if(!minesLocation.includes(id)){
            minesLocation.push(id);
            minesLeft-=1;
        }
    }
}
function startGame(){
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click",setFlag);
    setMines();
    //populate the board
    board=[];
    
    for(let r=0;r<rows;r++){
        let row=[];
        for(let c=0;c<columns;c++){
            //<div></div>
            let tile = document.createElement("div");
            tile.id=r.toString()+"-"+c.toString();
            tile.addEventListener("click",clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
    console.log(board);
}
function setFlag(){
    if(flagEnabled){
        flagEnabled=false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }
    else{
        flagEnabled=true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}
function clickTile(){
    if(flag===true){
        startTimer();
        flag=false;
    }
    if(gameOver||this.classList.contains("tile-clicked")){
        return;
    }
    let tile = this;
    if(flagEnabled){
        if(tile.innerText===""){
            tile.innerText="🚩";
        }
        else if(tile.innerText){
            tile.innerText="";
        }
        return;//to not activate a mine by flag accidently
    }
    if(minesLocation.includes(tile.id)){
        revealMines();
        let x=stopTimer();
        alert("Game Over in "+ x +" seconds");
        gameOver=true;
        return;
    }

    let coords = tile.id.split("-");//"0-0"=>["0","0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r,c);
}
function startTimer(){
    if(timer){
        clearInterval(timer);
    }
    seconds = 0;
    document.getElementById("timer").innerText = seconds;
    timer = setInterval(()=>{
        seconds++;
        document.getElementById("timer").innerText = seconds;
    },1000);
}

function revealMines(){
    for(let r=0;r<rows;r++){
        for(let c=0;c<columns;c++){
            let tile = board[r][c];
            if(minesLocation.includes(tile.id)){
                tile.innerText="💥";
                tile.backgroundColor="red";
            }
        }
    }
}
function checkMine(r,c){
    if(r<0 || r>=rows || c<0 || c>=columns){
        return;
    }

    if(board[r][c].classList.contains("tile-clicked")){
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked+=1;
    let minesFound = 0;
    //top3
    minesFound+=checkTile(r-1,c-1);//topleft
    minesFound+=checkTile(r-1,c);//top
    minesFound+=checkTile(r-1,c+1);//topright

    //left and right
    minesFound+=checkTile(r,c-1);
    minesFound+=checkTile(r,c+1);

    //bottom3
    minesFound+=checkTile(r+1,c-1);//bottomleft
    minesFound+=checkTile(r+1,c);//bottom
    minesFound+=checkTile(r+1,c+1);//bottomright

    if(minesFound>0){
        board[r][c].innerText=minesFound;
        board[r][c].classList.add("x"+minesFound.toString());
    }
    else{
        checkMine(r-1,c-1);
        checkMine(r-1,c);
        checkMine(r-1,c+1);
        checkMine(r,c-1);
        checkMine(r,c+1);
        checkMine(r+1,c-1);
        checkMine(r+1,c);
        checkMine(r+1,c+1);
    }
    if(tilesClicked==rows*columns-minesCount){
        gameOver=true;
        let t = stopTimer();
        document.getElementById("mines-count").innerText=`Cleared in ${t} seconds!!`;
    }
}
function checkTile(r,c){
    if(r<0 || r>=rows || c<0 || c>=columns){
        return 0;
    }
    if(minesLocation.includes(r.toString()+"-"+c.toString())){
        return 1;
    }
    return 0;
}
function stopTimer(){
    if(timer){
        clearInterval(timer);
    }
    return seconds;
}
function resetGame(){
    stopTimer();
    gameOver = false;
    tilesClicked = 0;
    flag = true;
    minesCount=0;
    document.getElementById("timer").innerText = 0;
    document.getElementById("board").innerText = "";
    startGame();
}