/* ===== 完成盤生成 ===== */

function generateFullBoard(){
let board = createEmptyBoard();

function fill(){
for(let r=0;r<9;r++){
for(let c=0;c<9;c++){
if(board[r][c]===0){

let nums = shuffle([1,2,3,4,5,6,7,8,9]);

for(let n of nums){
if(isValid(board,r,c,n)){
board[r][c]=n;
if(fill()) return true;
board[r][c]=0;
}
}

return false;
}
}
}
return true;
}

fill();
return board;
}

/* ===== シャッフル ===== */

function shuffle(arr){
return arr.sort(()=>Math.random()-0.5);
}

/* ===== 唯一解チェック ===== */

function countSolutions(board){
let count = 0;

function dfs(b){
if(count >= 2) return;

for(let r=0;r<9;r++){
for(let c=0;c<9;c++){
if(b[r][c]===0){
for(let n=1;n<=9;n++){
if(isValid(b,r,c,n)){
b[r][c]=n;
dfs(b);
b[r][c]=0;
}
}
return;
}
}
}

count++;
}

dfs(JSON.parse(JSON.stringify(board)));
return count;
}

/* ===== 難易度計測 ===== */

function measureDifficulty(board){
let copy = JSON.parse(JSON.stringify(board));
let score = 0;

function solveCount(b){
for(let r=0;r<9;r++){
for(let c=0;c<9;c++){
if(b[r][c]===0){
for(let n=1;n<=9;n++){
if(isValid(b,r,c,n)){
b[r][c]=n;
score++;
if(solveCount(b)) return true;
b[r][c]=0;
}
}
return false;
}
}
}
return true;
}

solveCount(copy);
return score;
}

/* ===== レベル範囲 ===== */

function inLevel(score, level){
if(level==1) return score>=5 && score<=10;
if(level==2) return score>=10 && score<=16;
if(level==3) return score>=15 && score<=24;
if(level==4) return score>=25 && score<=32;
if(level==5) return score>=28 && score<=35;
if(level==6) return score>=30 && score<=39;
}

/* ===== 本物生成 ===== */

function generatePuzzleByLevel(level){

while(true){

let full = generateFullBoard();
let puzzle = JSON.parse(JSON.stringify(full));

let cells = [];
for(let i=0;i<81;i++) cells.push(i);
cells = shuffle(cells);

for(let i of cells){

let r = Math.floor(i/9);
let c = i%9;

let backup = puzzle[r][c];
puzzle[r][c] = 0;

// 唯一解チェック
if(countSolutions(puzzle) !== 1){
puzzle[r][c] = backup;
}
}

// 難易度測定
let score = measureDifficulty(puzzle);

if(inLevel(score, level)){
return puzzle;
}

// 合わなければ作り直し
}
}