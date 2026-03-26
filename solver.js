/* ===== 有効判定 ===== */

function isValid(board, r, c, n){
// 行
for(let i=0;i<9;i++){
if(board[r][i] === n) return false;
}

// 列
for(let i=0;i<9;i++){
if(board[i][c] === n) return false;
}

// 3×3
let br = Math.floor(r/3)*3;
let bc = Math.floor(c/3)*3;

for(let i=0;i<3;i++){
for(let j=0;j<3;j++){
if(board[br+i][bc+j] === n) return false;
}
}

return true;
}

/* ===== 候補取得 ===== */

function getCandidates(board, r, c){
let used = new Set();

for(let i=0;i<9;i++){
used.add(board[r][i]);
used.add(board[i][c]);
}

let br = Math.floor(r/3)*3;
let bc = Math.floor(c/3)*3;

for(let i=0;i<3;i++){
for(let j=0;j<3;j++){
used.add(board[br+i][bc+j]);
}
}

let candidates = [];
for(let n=1;n<=9;n++){
if(!used.has(n)) candidates.push(n);
}

return candidates;
}

/* ===== MRV（最小候補マス探す） ===== */

function findBestCell(board){
let minLen = 10;
let best = null;

for(let r=0;r<9;r++){
for(let c=0;c<9;c++){
if(board[r][c] === 0){
let candidates = getCandidates(board,r,c);

if(candidates.length < minLen){
minLen = candidates.length;
best = {r,c,candidates};

if(minLen === 1) return best; // 最速
}
}
}
}

return best;
}

/* ===== シャッフル ===== */

function shuffle(arr){
return arr.sort(()=>Math.random()-0.5);
}

/* ===== 高速ソルバー ===== */

function solve(board){
let cell = findBestCell(board);

if(!cell) return true; // 完成

let {r,c,candidates} = cell;

candidates = shuffle(candidates); // ランダム化

for(let n of candidates){
board[r][c] = n;

if(solve(board)) return true;

board[r][c] = 0;
}

return false;
}

/* ===== 解カウント（高速版） ===== */

function countSolutions(board){
let count = 0;

function dfs(b){
if(count >= 2) return;

let cell = findBestCell(b);
if(!cell){
count++;
return;
}

let {r,c,candidates} = cell;

for(let n of candidates){
b[r][c] = n;
dfs(b);
b[r][c] = 0;
}
}

dfs(JSON.parse(JSON.stringify(board)));
return count;
}