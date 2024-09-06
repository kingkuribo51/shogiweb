// 将棋盤を描画する関数
const socket = io();
let condition = 0; //駒が選択されているか
let selectrow, selectcol,selectid; //選択したコマ
let selecthaving; //選択した持ち駒
let first = 0;//初期動作
let check=0; //駒が動けるか
let checkboardRow = [];//駒が動けるマス
let checkboardCol = []
//盤面の駒
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
//持ち駒
let mypieces = [];
let opponent_pieces = [];

//駒を描画する
function piecerender() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            cell.textContent = pieces[row][col];
            
            //初期に自駒と相手駒を認識
            if(row >=6 && cell.textContent != "" && first == 0) {
            cell.id = 'player0'; //player1の駒
            } else if(row <=2 && cell.textContent != "" && first == 0) {
                cell.id = 'player1';//player2の駒
            }  else if(cell.textContent == "" && first == 0) {
                cell.id = 'void';//空白地帯
            }
        }
    }
    first =1;
}

//持ち駒描画
function mypiecesrender() {
    for(let catchid = 0; catchid < 20; catchid++) {
        const opponentcatchcell = document.querySelector(`[data-opponentid="${catchid}"]`);
        opponentcatchcell.textContent = opponent_pieces[catchid];
        const mycatchcell = document.querySelector(`[data-myid="${catchid}"]`);
        mycatchcell.textContent = mypieces[catchid];
    }
}

//マスがクリックされたとき
function piececlick(row,col) {
    //敵か味方かを取得
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    const player= cell.id
    console.log(`player変数${player}`);

    //駒選択状態でなく、駒がクリックされたとき、駒選択状態にする
    if(condition == 0 && pieces[row][col] != "") {
        //次に選択された駒を決ために代入
        selectid=player;
        selectrow = row;
        selectcol = col;

        checkmoving(row, col, cell.textContent, cell.id);

        //condotion1へ
        conditionswitchTo1(row, col);
        return;

        //選択状態の時移動先のマスを選ぶ
    } else if (condition ==1) {
        //同じ陣地の駒が選択されたら選択状態をキャンセル
        if(cell.id == selectid) {

            //condition0へ
            conditionswitchTo0();
            return;
        }

        //駒を動かす関数へ
        for(let i=0; i < checkboardRow.length; i++) {
            console.log(`移動先候補:列${checkboardRow[i]} 行${checkboardCol[i]}`);
            if(checkboardRow[i] == row && checkboardCol[i] == col)
            movepiece(row, col);
        }

        //condition0へ
        conditionswitchTo0();
        return;

        //指す駒を選択しているときに空白を押すと指す
    } else if(condition == 2 && pieces[row][col] == "") {

        //指し駒を指す関数へ移動
        sasimove(row, col);

        conditionswitchTo0();
        return;
    }
}

//駒を動かす
function movepiece(moverow, movecol) {
    //駒情報を取得
    const newcell = document.querySelector(`[data-row="${moverow}"][data-col="${movecol}"]`);
    const oldcell = document.querySelector(`[data-row="${selectrow}"][data-col="${selectcol}"]`);
   
    //持ち駒を取得する関数へ移動
    catchpiece(newcell, oldcell);

    //プレイヤー変数を受け渡し
    newcell.id = selectid;
    oldcell.id = 'void';
    //座標を受け渡し
    pieces[moverow][movecol] = pieces[selectrow][selectcol];
    pieces[selectrow][selectcol] = "";

    //駒を描画
    piecerender();
    mypiecesrender();

    
}

function catchpiece(newcell, oldcell) {
    //駒を取ったら持ち駒へ
    if (newcell.id == 'player1' && oldcell.id =='player0') {
       mypieces.push(newcell.textContent);
       console.log(`自分の持ち駒${mypieces}`);
    } else if(newcell.id == 'player0' && oldcell.id =='player1') {
        opponent_pieces.push(newcell.textContent);
        console.log(`相手の持ち駒${opponent_pieces}`);
    }
}

//指す駒を選択
function sasu(dataId, player) {
    if (player ==0) {
        const mycell = document.querySelector(`[data-myid="${dataId}"]`);
        if(condition == 0 && mycell.textContent != "" && mycell.textContent != undefined && mycell.textContent!= null) {
            selecthaving = dataId;

            //condition2へ
            conditionswitchTo2(selecthaving, player);
            selectid = mycell.id;
        }

    } else if(player == 1) {
        const oppocell = document.querySelector(`[data-opponentid="${dataId}"]`);
        if(condition == 0 && oppocell.textContent != "" && oppocell.textContent != undefined && oppocell.textContent!= null) {
            selecthaving = dataId;
    
            //condition2へ
            conditionswitchTo2(selecthaving, player);
            selectid = oppocell.id;
        }
    }
}

//指し駒を指す
function sasimove(row, col) {
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);

    if(selectid == 'player0') {
        pieces[row][col] = mypieces[selecthaving];
        mypieces.splice(selecthaving, 1);
        cell.id='player0';
    } else if(selectid == 'player1') {
        pieces[row][col] = opponent_pieces[selecthaving];
        opponent_pieces.splice(selecthaving, 1);
        cell.id='player1';
    }
    //駒を描画
    piecerender();
    mypiecesrender();
}

//contiditionを1待機状態
function conditionswitchTo1(row, col) {
    condition =1;
    console.log(`condotion=${condition} 選択中`)
    //背景色変更
    const selectedcell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    selectedcell.classList.add('selected');
}
//contiditionを2指し駒待機状態
function conditionswitchTo2(Id, player) {
    condition =2;
    console.log(`condition=${condition} 指し駒選択中`)
    //背景色変更
    if (player == 0) {
        const mycell = document.querySelector(`[data-myid="${Id}"]`);
        mycell.classList.add('selected');
    } else if(player == 1) {
        const oppocell = document.querySelector(`[data-opponentid="${Id}"]`);
        oppocell.classList.add('selected');
    }
}
//conditionを0 sr sc siをnullに
function conditionswitchTo0() {
    condition =0;
    selectid = null;
    selectrow = null;
    selectcol = null;
    selecthaving = null;
    checkboardRow = [];
    checkboardCol = [];
    console.log(`condition=${condition} 選択取り消し`)
    //背景色を元に戻す
    if (removecells = document.querySelectorAll('.selected')) {
        removecells.forEach(removecell => {
            removecell.classList.remove('selected');
        });
    }
    if(removecells = document.querySelectorAll('.possible')) {
        removecells.forEach(removecell => {
            removecell.classList.remove('possible');
        });
    }
}

window.onload = () => {
    piecerender(); // 初期配置を反映
    mypiecesrender();
}


//移動作制限関数　以下長いので制限に関するものだけ記す
function checkmoving(row, col, text, id) {
    //my側の駒の動き
    if (id == 'player0') {
        if (text == '歩') {
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col}"]`)) {
                checkboardRow[0] = row-1;
                checkboardCol[0] = col;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
                }
            }
        }
        if (text == '香') {
           for(let i=0; i<row; i++) {
            const cell = document.querySelector(`[data-row="${row-i-1}"][data-col="${col}"]`);
            if(cell.id == 'player0') {
                break;
            } else if(cell.id == 'player1') {
            checkboardRow[0+i] = row-i-1;
            checkboardCol[0+i] = col;
            cell.classList.add('possible');
            break;
            }
            checkboardRow[0+i] = row-i-1;
            checkboardCol[0+i] = col;
            cell.classList.add('possible');
           }
        }
        if (text == '桂') {
            if(cell = document.querySelector(`[data-row="${row-2}"][data-col="${col+1}"]`)) {
            checkboardRow[0] = row-2;
            checkboardCol[0] = col+1;
            if(cell.id != 'player0') {
                cell.classList.add('possible');
            }
        }
            if(cell = document.querySelector(`[data-row="${row-2}"][data-col="${col-1}"]`)) {
                checkboardRow[1] = row-2;
                checkboardCol[1] = col-1;
            if(cell.id != 'player0') {
                cell.classList.add('possible');
            }
        }
    }
        if (text == '銀') {
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col}"]`)) {
                checkboardRow[0] = row-1;
                checkboardCol[0] = col;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
            }
        }
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col+1}"]`)) {
                checkboardRow[1] = row-1;
                checkboardCol[1] = col+1;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
                }
        }
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col-1}"]`)) {
                checkboardRow[2] = row-1;
                checkboardCol[2] = col-1;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
            }
        }
            if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col+1}"]`)) {
                checkboardRow[3] = row+1;
                checkboardCol[3] = col+1;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
            }
        }
            if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col-1}"]`)) {
                checkboardRow[4] = row+1;
                checkboardCol[4] = col-1;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
            }
        }
    }
        if (text == '金' || text == 'と') {
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col}"]`)) {
                checkboardRow[0] = row-1;
                checkboardCol[0] = col;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
            }
        }
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col+1}"]`)) {
                checkboardRow[1] = row-1;
                checkboardCol[1] = col+1;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
                }
        }
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col-1}"]`)) {
                checkboardRow[2] = row-1;
                checkboardCol[2] = col-1;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
            }
        }
            if(cell = document.querySelector(`[data-row="${row}"][data-col="${col+1}"]`)) {
                checkboardRow[3] = row;
                checkboardCol[3] = col+1;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
            }
        }
            if(cell = document.querySelector(`[data-row="${row}"][data-col="${col-1}"]`)) {
                checkboardRow[4] = row;
                checkboardCol[4] = col-1;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
            }
        }
            if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col}"]`)) {
                checkboardRow[5] = row+1;
                checkboardCol[5] = col;
            if(cell.id != 'player0') {
                cell.classList.add('possible');
            }
        }  
    }
        if (text == '王') {
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col}"]`)) {
                checkboardRow[0] = row-1;
                checkboardCol[0] = col;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
            }
        }
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col+1}"]`)) {
                checkboardRow[1] = row-1;
                checkboardCol[1] = col+1;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
                }
        }
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col-1}"]`)) {
                checkboardRow[2] = row-1;
                checkboardCol[2] = col-1;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
            }
        }
            if(cell = document.querySelector(`[data-row="${row}"][data-col="${col+1}"]`)) {
                checkboardRow[3] = row;
                checkboardCol[3] = col+1;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
            }
        }
            if(cell = document.querySelector(`[data-row="${row}"][data-col="${col-1}"]`)) {
                checkboardRow[4] = row;
                checkboardCol[4] = col-1;
                if(cell.id != 'player0') {
                    cell.classList.add('possible');
            }
        }
            if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col}"]`)) {
                checkboardRow[5] = row+1;
                checkboardCol[5] = col;
            if(cell.id != 'player0') {
                cell.classList.add('possible');
            }
        }
            if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col-1}"]`)) {
                checkboardRow[6] = row+1;
                checkboardCol[6] = col-1;
            if(cell.id != 'player0') {
                cell.classList.add('possible');
            }
        }
            if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col+1}"]`)) {
                checkboardRow[7] = row+1;
                checkboardCol[7] = col+1;
            if(cell.id != 'player0') {
                cell.classList.add('possible');
            }
        }
    }
        if (text == '飛') {
            let j = 0;
            //上方向
            for(let i=0; i<row; i++) {
                let cell = document.querySelector(`[data-row="${row-i-1}"][data-col="${col}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i] = row-i-1;
                checkboardCol[0+i] = col;
                cell.classList.add('possible');
                j++;
                break;
                }
                checkboardRow[0+i] = row-i-1;
                checkboardCol[0+i] = col;
                cell.classList.add('possible');
                j++;
            }
            //下方向
            for(let i=0; i<8-row; i++) {
                const cell = document.querySelector(`[data-row="${row+i+1}"][data-col="${col}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i+j] = row+i+1;
                checkboardCol[0+i+j] = col;
                cell.classList.add('possible');
                j++;
                break;
                }
                checkboardRow[0+i+j] = row+i+1;
                checkboardCol[0+i+j] = col;
                cell.classList.add('possible');
                j++;
            }
            //右方向
            for(let i=0; i<8-col; i++) {
                const cell = document.querySelector(`[data-row="${row}"][data-col="${col+i+1}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i+j] = row;
                checkboardCol[0+i+j] = col+i+1;
                cell.classList.add('possible');
                j++;
                break;
                }
                checkboardRow[0+i+j] = row;
                checkboardCol[0+i+j] = col+i+1;
                cell.classList.add('possible');
                j++;
        }
            //左方向
            for(let i=0; i<col; i++) {
                const cell = document.querySelector(`[data-row="${row}"][data-col="${col-i-1}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i+j] = row;
                checkboardCol[0+i+j] = col-i-1;
                cell.classList.add('possible');
                j++;
                break;
                }
                checkboardRow[0+i+j] = row;
                checkboardCol[0+i+j] = col-i-1;
                cell.classList.add('possible');
                j++;
            }
        }   
    if (text == '角') {
        let j = 0;
            //右上方向
            for(let i =0; i < row && i < 8-col; i++) {
                const cell = document.querySelector(`[data-row="${row-i-1}"][data-col="${col+i+1}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i] = row-i-1;
                checkboardCol[0+i] = col+i+1;
                cell.classList.add('possible');
                j++;
                break;
                }
                checkboardRow[0+i] = row-i-1;
                checkboardCol[0+i] = col+i+1;
                cell.classList.add('possible');
                j++;
            }
            //左上方向
            for(let i=0; i < row && i < col; i++) {
                const cell = document.querySelector(`[data-row="${row-i-1}"][data-col="${col-i-1}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i+j] = row-i-1;
                checkboardCol[0+i+j] = col-i-1;
                cell.classList.add('possible');
                j++;
                break;
                }
                checkboardRow[0+i+j] = row-i-1;
                checkboardCol[0+i+j] = col-i-1;
                cell.classList.add('possible');
                j++;
            }
            //右下方向
            for(let i=0; i<8-row && i<8-col; i++) {
                const cell = document.querySelector(`[data-row="${row+i+1}"][data-col="${col+i+1}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i+j] = row+i+1;
                checkboardCol[0+i+j] = col+i+1;
                cell.classList.add('possible');
                j++;
                break;
                }
                checkboardRow[0+i+j] = row+i+1;
                checkboardCol[0+i+j] = col+i+1;
                cell.classList.add('possible');
                j++;
             }
            //左下方向
            for(let i=0; i<8-row && i<col; i++) {
                const cell = document.querySelector(`[data-row="${row+i+1}"][data-col="${col-i-1}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i+j] = row+i+1;
                checkboardCol[0+i+j] = col-i-1;
                cell.classList.add('possible');
                j++;
                break;
                }
                checkboardRow[0+i+j] = row+i+1;
                checkboardCol[0+i+j] = col-i-1;
                cell.classList.add('possible');
                j++;
            }
        }
    }






//opponent側の駒の動き
if (id == 'player1') {
    if (text == '歩') {
        if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col}"]`)) {
            checkboardRow[0] = row+1;
            checkboardCol[0] = col;
            if(cell.id != 'player1') {
                cell.classList.add('possible');
            }
        }
    }
    if (text == '香') {
       for(let i=0; i<8-row; i++) {
        const cell = document.querySelector(`[data-row="${row+i+1}"][data-col="${col}"]`);
        if(cell.id == 'player1') {
            break;
        } else if(cell.id == 'player0') {
        checkboardRow[0+i] = row+i+1;
        checkboardCol[0+i] = col;
        cell.classList.add('possible');
        break;
        }
        checkboardRow[0+i] = row+i+1;
        checkboardCol[0+i] = col;
        cell.classList.add('possible');
       }
    }
    if (text == '桂') {
        if(cell = document.querySelector(`[data-row="${row+2}"][data-col="${col+1}"]`)) {
        checkboardRow[0] = row+2;
        checkboardCol[0] = col+1;
        if(cell.id != 'player1') {
            cell.classList.add('possible');
        }
    }
        if(cell = document.querySelector(`[data-row="${row+2}"][data-col="${col-1}"]`)) {
            checkboardRow[1] = row+2;
            checkboardCol[1] = col-1;
        if(cell.id != 'player1') {
            cell.classList.add('possible');
        }
    }
}
    if (text == '銀') {
        if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col}"]`)) {
            checkboardRow[0] = row+1;
            checkboardCol[0] = col;
            if(cell.id != 'player1') {
                cell.classList.add('possible');
        }
    }
        if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col-1}"]`)) {
            checkboardRow[1] = row+1;
            checkboardCol[1] = col-1;
            if(cell.id != 'player1') {
                cell.classList.add('possible');
            }
    }
        if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col+1}"]`)) {
            checkboardRow[2] = row+1;
            checkboardCol[2] = col+1;
            if(cell.id != 'player1') {
                cell.classList.add('possible');
        }
    }
        if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col-1}"]`)) {
            checkboardRow[3] = row-1;
            checkboardCol[3] = col-1;
            if(cell.id != 'player1') {
                cell.classList.add('possible');
        }
    }
        if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col+1}"]`)) {
            checkboardRow[4] = row-1;
            checkboardCol[4] = col+1;
            if(cell.id != 'player1') {
                cell.classList.add('possible');
        }
    }
}
    if (text == '金' || text == 'と') {
        if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col}"]`)) {
            checkboardRow[0] = row+1;
            checkboardCol[0] = col;
            if(cell.id != 'player1') {
                cell.classList.add('possible');
        }
    }
        if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col-1}"]`)) {
            checkboardRow[1] = row+1;
            checkboardCol[1] = col-1;
            if(cell.id != 'player1') {
                cell.classList.add('possible');
            }
    }
        if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col+1}"]`)) {
            checkboardRow[2] = row+1;
            checkboardCol[2] = col+1;
            if(cell.id != 'player1') {
                cell.classList.add('possible');
        }
    }
        if(cell = document.querySelector(`[data-row="${row}"][data-col="${col-1}"]`)) {
            checkboardRow[3] = row;
            checkboardCol[3] = col-1;
            if(cell.id != 'player1') {
                cell.classList.add('possible');
        }
    }
        if(cell = document.querySelector(`[data-row="${row}"][data-col="${col+1}"]`)) {
            checkboardRow[4] = row;
            checkboardCol[4] = col+1;
            if(cell.id != 'player1') {
                cell.classList.add('possible');
        }
    }
        if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col}"]`)) {
            checkboardRow[5] = row-1;
            checkboardCol[5] = col;
        if(cell.id != 'player1') {
            cell.classList.add('possible');
        }
    }  
}
    if (text == '王') {
        if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col}"]`)) {
            checkboardRow[0] = row-1;
            checkboardCol[0] = col;
            if(cell.id != 'player1') {
                cell.classList.add('possible');
        }
    }
        if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col+1}"]`)) {
            checkboardRow[1] = row-1;
            checkboardCol[1] = col+1;
            if(cell.id != 'player1') {
                cell.classList.add('possible');
            }
    }
        if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col-1}"]`)) {
            checkboardRow[2] = row-1;
            checkboardCol[2] = col-1;
            if(cell.id != 'player1') {
                cell.classList.add('possible');
        }
    }
        if(cell = document.querySelector(`[data-row="${row}"][data-col="${col+1}"]`)) {
            checkboardRow[3] = row;
            checkboardCol[3] = col+1;
            if(cell.id != 'player1') {
                cell.classList.add('possible');
        }
    }
        if(cell = document.querySelector(`[data-row="${row}"][data-col="${col-1}"]`)) {
            checkboardRow[4] = row;
            checkboardCol[4] = col-1;
            if(cell.id != 'player1') {
                cell.classList.add('possible');
        }
    }
        if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col}"]`)) {
            checkboardRow[5] = row+1;
            checkboardCol[5] = col;
        if(cell.id != 'player1') {
            cell.classList.add('possible');
        }
    }
        if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col-1}"]`)) {
            checkboardRow[6] = row+1;
            checkboardCol[6] = col-1;
        if(cell.id != 'player1') {
            cell.classList.add('possible');
        }
    }
        if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col+1}"]`)) {
            checkboardRow[7] = row+1;
            checkboardCol[7] = col+1;
        if(cell.id != 'player1') {
            cell.classList.add('possible');
        }
    }
}
    if (text == '飛') {
        let j = 0;
        //上方向
        for(let i=0; i<row; i++) {
            const cell = document.querySelector(`[data-row="${row-i-1}"][data-col="${col}"]`);
            if(cell.id == 'player1') {
                break;
            } else if(cell.id == 'player0') {
            checkboardRow[0+i] = row-i-1;
            checkboardCol[0+i] = col;
            cell.classList.add('possible');
            j++;
            break;
            }
            checkboardRow[0+i] = row-i-1;
            checkboardCol[0+i] = col;
            cell.classList.add('possible');
            j++;
        }
        //下方向
        for(let i=0; i<8-row; i++) {
            const cell = document.querySelector(`[data-row="${row+i+1}"][data-col="${col}"]`);
            if(cell.id == 'player1') {
                break;
            } else if(cell.id == 'player0') {
            checkboardRow[0+i+j] = row+i+1;
            checkboardCol[0+i+j] = col;
            cell.classList.add('possible');
            j++;
            break;
            }
            checkboardRow[0+i+j] = row+i+1;
            checkboardCol[0+i+j] = col;
            cell.classList.add('possible');
            j++;
        }
        //右方向
        for(let i=0; i<8-col; i++) {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col+i+1}"]`);
            if(cell.id == 'player1') {
                break;
            } else if(cell.id == 'player0') {
            checkboardRow[0+i+j] = row;
            checkboardCol[0+i+j] = col+i+1;
            cell.classList.add('possible');
            j++;
            break;
            }
            checkboardRow[0+i+j] = row;
            checkboardCol[0+i+j] = col+i+1;
            cell.classList.add('possible');
            j++;
    }
        //左方向
        for(let i=0; i<col; i++) {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col-i-1}"]`);
            if(cell.id == 'player1') {
                break;
            } else if(cell.id == 'player0') {
            checkboardRow[0+i+j] = row;
            checkboardCol[0+i+j] = col-i-1;
            cell.classList.add('possible');
            j++;
            break;
            }
            checkboardRow[0+i+j] = row;
            checkboardCol[0+i+j] = col-i-1;
            cell.classList.add('possible');
            j++;
        }
    }   
if (text == '角') {
    let j = 0;
        //右上方向
        for(let i =0; i < row && i < 8-col; i++) {
            const cell = document.querySelector(`[data-row="${row-i-1}"][data-col="${col+i+1}"]`);
            if(cell.id == 'player1') {
                break;
            } else if(cell.id == 'player0') {
            checkboardRow[0+i] = row-i-1;
            checkboardCol[0+i] = col+i+1;
            cell.classList.add('possible');
            j++;
            break;
            }
            checkboardRow[0+i] = row-i-1;
            checkboardCol[0+i] = col+i+1;
            cell.classList.add('possible');
            j++;
        }
        //左上方向
        for(let i=0; i < row && i < col; i++) {
            const cell = document.querySelector(`[data-row="${row-i-1}"][data-col="${col-i-1}"]`);
            if(cell.id == 'player1') {
                break;
            } else if(cell.id == 'player0') {
            checkboardRow[0+i+j] = row-i-1;
            checkboardCol[0+i+j] = col-i-1;
            cell.classList.add('possible');
            j++;
            break;
            }
            checkboardRow[0+i+j] = row-i-1;
            checkboardCol[0+i+j] = col-i-1;
            cell.classList.add('possible');
            j++;
        }
        //右下方向
        for(let i=0; i<8-row && i<8-col; i++) {
            const cell = document.querySelector(`[data-row="${row+i+1}"][data-col="${col+i+1}"]`);
            if(cell.id == 'player1') {
                break;
            } else if(cell.id == 'player0') {
            checkboardRow[0+i+j] = row+i+1;
            checkboardCol[0+i+j] = col+i+1;
            cell.classList.add('possible');
            j++;
            break;
            }
            checkboardRow[0+i+j] = row+i+1;
            checkboardCol[0+i+j] = col+i+1;
            cell.classList.add('possible');
            j++;
         }
        //左下方向
        for(let i=0; i<8-row && i<col; i++) {
            const cell = document.querySelector(`[data-row="${row+i+1}"][data-col="${col-i-1}"]`);
            if(cell.id == 'player1') {
                break;
            } else if(cell.id == 'player0') {
            checkboardRow[0+i+j] = row+i+1;
            checkboardCol[0+i+j] = col-i-1;
            cell.classList.add('possible');
            j++;
            break;
            }
            checkboardRow[0+i+j] = row+i+1;
            checkboardCol[0+i+j] = col-i-1;
            cell.classList.add('possible');
            j++;
        }
    }
}
}