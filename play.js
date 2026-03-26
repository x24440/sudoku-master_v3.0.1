let original = createEmptyBoard();
let fixed = createEmptyBoard().map(r=>r.map(()=>false));
let board = createEmptyBoard();

let answer = createEmptyBoard();

let notes = Array.from({length:9},()=>
Array.from({length:9},()=> new Set())
);

let memoMode = false;
let selected = null;

let container = document.getElementById("board");
let numpad = document.getElementById("numpad");

/* ========================= */
/* ===== 新規生成 ===== */
/* ========================= */

function generate(){
let level = parseInt(document.getElementById("level").value);

let puzzle = generatePuzzleByLevel(level);

original = JSON.parse(JSON.stringify(puzzle));
board = JSON.parse(JSON.stringify(puzzle));

// 固定マス設定
fixed = puzzle.map(row => row.map(v => v !== 0));

// 解答作成
answer = JSON.parse(JSON.stringify(puzzle));
solve(answer);

// メモ初期化
notes = Array.from({length:9},()=>
Array.from({length:9},()=> new Set())
);

selected = null;

render();
calculateDifficulty();
}

/* ========================= */
/* ===== 難易度表示 ===== */
/* ========================= */

let difficultyScore = 0;

function solveWithCount(b){
for(let r=0;r<9;r++){
for(let c=0;c<9;c++){
if(b[r][c]===0){
for(let n=1;n<=9;n++){
if(isValid(b,r,c,n)){
b[r][c]=n;
difficultyScore++;
if(solveWithCount(b)) return true;
b[r][c]=0;
}
}
return false;
}
}
}
return true;
}

function applyThemeByScore(score){
document.body.className = ""

if(score <= 10) document.body.classList.add("easy");
else if(score <= 16) document.body.classList.add("normal");
else if(score <= 24) document.body.classList.add("hard");
else if(score <= 32) document.body.classList.add("expert");
else if(score <= 35) document.body.classList.add("master");
else document.body.classList.add("append");
}

function calculateDifficulty(){
let copy = JSON.parse(JSON.stringify(original));
difficultyScore = 0;
solveWithCount(copy);

let star, label;

if(difficultyScore <= 10){
star = 1; label = "EASY"
} else if(difficultyScore <= 16){
star = 2; label = "NORMAL"
} else if(difficultyScore <= 24){
star = 3; label = "HARD"
} else if(difficultyScore <= 32){
star = 4; label = "EXPERT"
} else if(difficultyScore <= 35){
star = 5; label = "MASTER"
} else {
star = 6; label = "APPEND"
}

let stars = "⭐".repeat(star);

document.getElementById("difficulty").textContent =
`${stars} ${label}（${difficultyScore}）`;

applyThemeByScore(difficultyScore);
}

/* ========================= */
/* ===== 描画 ===== */
/* ========================= */

render();
createNumpad();

function render(){
container.innerHTML = ""

for(let r=0;r<9;r++){
for(let c=0;c<9;c++){

let cell = document.createElement("div");
cell.className = "cell"

if(fixed[r][c]){
cell.classList.add("fixed");
}

cell.onclick = ()=>{
if(fixed[r][c]) return;
selected = {r, c};
render();
};

if(selected && selected.r===r && selected.c===c){
cell.style.background = "#ddd"
}

if(board[r][c] !== 0){
cell.textContent = board[r][c];
} else if(notes[r][c].size > 0){
let grid = document.createElement("div");
grid.className = "note-grid"

for(let i=1;i<=9;i++){
let n = document.createElement("div");
n.className = "note"
n.textContent = notes[r][c].has(i) ? i : ""
grid.appendChild(n);
}

cell.appendChild(grid);
}

container.appendChild(cell);
}
}
}

/* ========================= */
/* ===== 入力 ===== */
/* ========================= */

function createNumpad(){
numpad.innerHTML = ""

for(let i=1;i<=9;i++){
let btn = document.createElement("button");
btn.textContent = i;
btn.onclick = ()=>inputNumber(i);
numpad.appendChild(btn);
}

let del = document.createElement("button");
del.textContent = "消"
del.onclick = ()=>inputNumber(0);
numpad.appendChild(del);
}

function inputNumber(val){
if(!selected) return;

let {r,c} = selected;

if(fixed[r][c]) return;

if(val === 0){
board[r][c] = 0;
notes[r][c].clear();
}
else if(memoMode){
if(notes[r][c].has(val)){
notes[r][c].delete(val);
} else {
notes[r][c].add(val);
}
}
else {
board[r][c] = val;
notes[r][c].clear();
}

render();
}

/* ========================= */
/* ===== その他 ===== */
/* ========================= */

function toggleMemo(){
memoMode = !memoMode;

document.getElementById("memoBtn").textContent =
"メモ: " + (memoMode ? "ON" : "OFF");
}

function check(){
let cells = container.children;
let correct = true;

for(let i=0;i<81;i++){
let r = Math.floor(i/9);
let c = i%9;

if(board[r][c] !== answer[r][c]){
cells[i].style.background = "lightblue"
correct = false;
}
}

document.getElementById("result").textContent =
correct ? "正解！" : "間違いがあります"
}

function reset(){
board = JSON.parse(JSON.stringify(original));
selected = null;

notes = Array.from({length:9},()=>
Array.from({length:9},()=> new Set())
);

render();
}
