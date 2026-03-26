/* ===== 背景変更 ===== */

function setBackground(){
let color = document.getElementById("bgColor").value;
document.body.style.background = color;

localStorage.setItem("bgColor", color);
}

function resetBackground(){
document.body.style.background = ""
localStorage.removeItem("bgColor");
}

/* ページ読み込み時 */
window.onload = ()=>{
let saved = localStorage.getItem("bgColor");
if(saved){
document.body.style.background = saved;
}
};

/* ===== 既存関数 ===== */

function createEmptyBoard() {
return Array.from({length:9},()=>Array(9).fill(0));
}
