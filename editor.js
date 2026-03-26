let board = createEmptyBoard();
let container = document.getElementById("board");

render();

/* ========================= */

function render(){
container.innerHTML = ""

for(let r=0;r<9;r++){
for(let c=0;c<9;c++){

let input = document.createElement("input");
input.className = "cell"
input.value = board[r][c] === 0 ? "" : board[r][c];
input.inputMode = "numeric"

input.oninput = (e)=>{
let val = parseInt(e.target.value) || 0;
if(val>=1 && val<=9){
board[r][c] = val;
} else {
board[r][c] = 0;
e.target.value=""
}
};

container.appendChild(input);
}
}
}

/* ===== 保存（固定マス含む） ===== */

function save(){
let fixed = board.map(row => row.map(v => v !== 0));

localStorage.setItem("sudoku", JSON.stringify({
board: board,
fixed: fixed
}));

alert("保存しました");
}
