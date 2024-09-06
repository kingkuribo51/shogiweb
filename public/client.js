// 将棋盤を描画する関数
const socket = io();
let condition = 0; //駒が選択されているか
let selectrow, selectcol,selectname; //選択したコマ
let first = 0;//初期動作
const pieces = [
    ['香', '桂', '銀', '金', '王', '金', '銀', '桂', '香'],
    ['', '飛', '', '', '', '', '', '角', ''],
    ['歩', '歩', '歩', '歩', '歩', '歩', '歩', '歩', '歩'],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['歩', '歩', '歩', '歩', '歩', '歩', '歩', '歩', '歩'],
    ['', '角', '', '', '', '', '', '飛', ''],
    ['香', '桂', '銀', '金', '王', '金', '銀', '桂', '香'],
];

function piecerender() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.querySelector(`a[data-row="${row}"][data-col="${col}"]`);
            cell.textContent = pieces[row][col];
            
            if(row >=6 && cell.textContent != "" && first == 0) {
            cell.dataset.name = 1; //player1の駒
            } else if(row <=2 && cell.textContent != "" && first == 0) {
                cell.dataset.name = 2;//player2の駒
            }  else if(cell.textContent == "" && first == 0) {
                cell.dataset.name = 0;//空白地帯
            }
        }
    }
    first =1;
}

//マスがクリックされたとき
function piececlick(row,col) {
    //敵か味方かを取得
    const cell = document.querySelector(`a[data-row="${row}"][data-col="${col}"]`);
    const player= cell.dataset.name;
    //駒選択状態でなく、駒がクリックされたとき、駒選択状態にする
    if(condition == 0 && pieces[row][col] != "") {
        console.log(`移動元:列${row+1}行${col+1}`);
        console.log(player);
        selectname=player;
        selectrow = row;
        selectcol = col;
        console.log("選択中");
        conditionswitchTo1();
        return;
        //選択状態の時移動先のマスを選ぶ
    } else if (condition ==1) {
        //同じ駒が選択されたら選択状態をキャンセル
        if(row == selectrow && col == selectcol) {
            console.log("選択取り消し");
            conditionswitchTo0();
            return;
        }
        console.log(`移動先:列${row+1}行${col+1}`);
        //駒を動かす
        console.log("移動");
        movepiece(row, col);
        conditionswitchTo0();
        return;
    }
    console.log("空白がタッチされました");
}

function movepiece(moverow, movecol) {
    const cell = document.querySelector(`a[data-row="${moverow}"][data-col="${movecol}"]`);
    cell.dataset.name = selectname;
    const oldcell = document.querySelector(`a[data-row="${selectrow}"][data-col="${selectcol}"]`);
    oldcell.dataset.name = 0;
    pieces[moverow][movecol] = pieces[selectrow][selectcol];
    pieces[selectrow][selectcol] = "";
    piecerender();
}

//contiditionを1待機状態
function conditionswitchTo1() {
    condition =1;
}
//conditionを0 sr scをnullに
function conditionswitchTo0() {
    condition =0;
    selectrow = null;
    selectcol = null;
}

    piecerender(); // 初期配置を反映
