// 将棋盤を描画する関数
const socket = io();
let condition = 0; //駒が選択されているか
let selectrow, selectcol,selectid; //選択したコマ
let selecthaving; //選択した持ち駒
let first = 0;//初期動作
let check=0; //駒が動けるか
let checkboardRow = [];//駒が動けるマス
let checkboardCol = [];
let management;
let turn;
let pieces = [];
let mypieces = [];
let opponent_pieces = [];
//盤面の駒
function gamereset() {
    first = 0;
pieces = [
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
mypieces = [];
opponent_pieces = [];
piecerender();
mypiecesrender();
conditionswitchTo0();
}


//socket処理
socket.on('start', () => {
    alert("対局を開始します");
    gamereset();
});

socket.on('playnumber', (playnumber) => {
    console.log("receve");
    management = playnumber;
    if(management ==0) {
    links = document.querySelectorAll(`#player${management}`);
    links.forEach(link => {
        link.style.pointerEvents = "auto";
        const cell = document.querySelector('#game-container');
        cell.style.transform = "rotate(0deg)";
    });
}
    if(management == 1) {
    const cell = document.querySelector('#game-container');
    cell.style.transform = "rotate(180deg)";
    }
});

socket.on('turn', () => {
    links = document.querySelectorAll(`#player${management}`);
    links.forEach(link => {
        link.style.pointerEvents = "auto";
    });
});

socket.on('notturn', () => {
    links = document.querySelectorAll(`#player${management}`);
    links.forEach(link => {
        link.style.pointerEvents = "none";
    });
});

socket.on('receve', (data) => {

    pieces = data.pieces;
    mypieces = data.mine;
    opponent_pieces = data.yours;
    let recognaze=0;
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
           cell.id=data.boardId[recognaze];
           recognaze++;
        }
    }
    for(let i=0; i<data.oppoId.length; i++) {
        const cell = document.querySelector(`[data-opponentid="${i}"]`);
        cell.id=data.oppoId[i];
    }
    for(let i=0; i<data.myId.length; i++) {
        const cell = document.querySelector(`[data-myid="${i}"]`);
        cell.id=data.myId[i];
    }
    piecerender();
    mypiecesrender();
});

socket.on('disconnected', () => {
    gamereset();
    location.reload();
});



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
    if(condition == 2 && cell.textContent != "") {
        conditionswitchTo0();
    }

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

    if(newcell.id == 'player0' && moverow <3 && pieces[moverow][movecol] == "歩") {
        pieces[moverow][movecol] = "と";
    } else if(newcell.id == 'player0' && moverow <3 && pieces[moverow][movecol] == "銀") {
        pieces[moverow][movecol] = "全";
    } else if(newcell.id == 'player0' && moverow <3 && pieces[moverow][movecol] == "香") {
        pieces[moverow][movecol] = "杏";
    } else if(newcell.id == 'player0' && moverow <3 && pieces[moverow][movecol] == "桂") {
        pieces[moverow][movecol] = "圭";
    } else if(newcell.id == 'player0' && moverow <3 && pieces[moverow][movecol] == "角") {
        pieces[moverow][movecol] = "馬";
    } else if(newcell.id == 'player0' && moverow <3 && pieces[moverow][movecol] == "飛") {
        pieces[moverow][movecol] = "龍";
    } else if(newcell.id == 'player0' && moverow <3 && pieces[moverow][movecol] == "歩") {
        pieces[moverow][movecol] = "と";
    } 
    if(newcell.id == 'player1' && moverow > 5 && pieces[moverow][movecol] == "歩") {
        pieces[moverow][movecol] = "と";
    } else if(newcell.id == 'player1' && moverow >5 && pieces[moverow][movecol] == "銀") {
        pieces[moverow][movecol] = "全";
    } else if(newcell.id == 'player1' && moverow >5 && pieces[moverow][movecol] == "香") {
        pieces[moverow][movecol] = "杏";
    } else if(newcell.id == 'player1' && moverow >5 && pieces[moverow][movecol] == "桂") {
        pieces[moverow][movecol] = "圭";
    } else if(newcell.id == 'player1' && moverow >5 && pieces[moverow][movecol] == "角") {
        pieces[moverow][movecol] = "馬";
    } else if(newcell.id == 'player1' && moverow >5 && pieces[moverow][movecol] == "飛") {
        pieces[moverow][movecol] = "龍";
    } else if(newcell.id == 'player1' && moverow >5 && pieces[moverow][movecol] == "歩") {
        pieces[moverow][movecol] = "と";
    } 

    //駒を描画
    piecerender();
    mypiecesrender();
    let oppoquery = document.querySelectorAll('.opponentpieces');
    let myquery = document.querySelectorAll('.mypieces');
    let query = document.querySelectorAll('.boardpieces');
    let oppoqueryId = [];
    let myqueryId = []; 
    let queryId = [];
    for(i=0; i<oppoquery.length; i++) {
        oppoqueryId[i] = oppoquery[i].id;
    }
    for(i=0; i<myquery.length; i++) {
        myqueryId[i] = myquery[i].id;
    }
    for(i=0; i<query.length; i++) {
        queryId[i] = query[i].id;
    }
    socket.emit('pieces', {pieces:pieces, mine:mypieces, yours: opponent_pieces, myId: myqueryId, oppoId: oppoqueryId, boardId: queryId});
    
}

function catchpiece(newcell, oldcell) {
    //駒を取ったら持ち駒へ
    if(newcell.textContent =="と") {
        newcell.textContent = "歩";
    } else if(newcell.textContent == "全") {
        newcell.textContent = "銀";
    }else if(newcell.textContent == "圭") {
        newcell.textContent = "桂";
    } else if(newcell.textContent == "杏") {
        newcell.textContent = "香";
    } else if(newcell.textContent == "龍") {
        newcell.textContent = "飛";
    } else if(newcell.textContent == "馬") {
        newcell.textContent = "角";
    }
    if (newcell.id == 'player1' && oldcell.id =='player0') {
       mypieces.push(newcell.textContent);
    } else if(newcell.id == 'player0' && oldcell.id =='player1') {
        opponent_pieces.push(newcell.textContent);
    }
}

//指す駒を選択
function sasu(dataId, player) {
    
    if (player ==0) {
        if(condition == 2) {
            conditionswitchTo0();
        }
        const mycell = document.querySelector(`[data-myid="${dataId}"]`);
        if(condition == 0 && mycell.textContent != "" && mycell.textContent != undefined && mycell.textContent!= null) {
            selecthaving = dataId;

            //condition2へ
            conditionswitchTo2(selecthaving, player);
            selectid = mycell.id;
        }

    } else if(player == 1) {
        if(condition == 2) {
            conditionswitchTo0();
        }
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
    let oppoquery = document.querySelectorAll('.opponentpieces');
    let myquery = document.querySelectorAll('.mypieces');
    let query = document.querySelectorAll('.boardpieces');
    let oppoqueryId = [];
    let myqueryId = []; 
    let queryId = [];
    for(i=0; i<oppoquery.length; i++) {
        oppoqueryId[i] = oppoquery[i].id;
    }
    for(i=0; i<myquery.length; i++) {
        myqueryId[i] = myquery[i].id;
    }
    for(i=0; i<query.length; i++) {
        queryId[i] = query[i].id;
    }
    socket.emit('pieces', {pieces:pieces, mine:mypieces, yours: opponent_pieces, myId: myqueryId, oppoId: oppoqueryId, boardId: queryId});
}

//contiditionを1待機状態
function conditionswitchTo1(row, col) {
    condition =1;
    console.log(`condotion=${condition} 選択中`)
    //背景色変更
    const selectedcell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    selectedcell.classList.add('selected');
    links = document.querySelectorAll('.boardpieces');
    links.forEach(link => {
        link.style.pointerEvents = "auto";
    });
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
    links = document.querySelectorAll('#void');
    links.forEach(link => {
        link.style.pointerEvents = "auto";
    });
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
    links = document.querySelectorAll(`#player${(management + 1) % 2}`);
    links.forEach(link => {
        link.style.pointerEvents = "none";
    });
    links2 = document.querySelectorAll('#void');
    links2.forEach(link => {
        link.style.pointerEvents = "none";
    });
}


//移動作制限関数　以下長いので制限に関するものだけ記す
function checkmoving(row, col, text, id) {
    //my側の駒の動き
    if (id == 'player0') {
        if (text == '歩') {
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col}"]`)) {
                checkboardRow[0] = row-1;
                checkboardCol[0] = col;
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
            break;
            }
            checkboardRow[0+i] = row-i-1;
            checkboardCol[0+i] = col;
           }
        }
        if (text == '桂') {
            if(cell = document.querySelector(`[data-row="${row-2}"][data-col="${col+1}"]`)) {
            checkboardRow[0] = row-2;
            checkboardCol[0] = col+1;
        }
            if(cell = document.querySelector(`[data-row="${row-2}"][data-col="${col-1}"]`)) {
                checkboardRow[1] = row-2;
                checkboardCol[1] = col-1;
        }
    }
        if (text == '銀') {
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col}"]`)) {
                checkboardRow[0] = row-1;
                checkboardCol[0] = col;
        }
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col+1}"]`)) {
                checkboardRow[1] = row-1;
                checkboardCol[1] = col+1;
        }
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col-1}"]`)) {
                checkboardRow[2] = row-1;
                checkboardCol[2] = col-1;
        }
            if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col+1}"]`)) {
                checkboardRow[3] = row+1;
                checkboardCol[3] = col+1;
        }
            if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col-1}"]`)) {
                checkboardRow[4] = row+1;
                checkboardCol[4] = col-1;
        }
    }
        if (text == '金' || text == 'と' || text == '圭' || text == '全' || text == '杏') {
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col}"]`)) {
                checkboardRow[0] = row-1;
                checkboardCol[0] = col;
        }
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col+1}"]`)) {
                checkboardRow[1] = row-1;
                checkboardCol[1] = col+1;
        }
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col-1}"]`)) {
                checkboardRow[2] = row-1;
                checkboardCol[2] = col-1;
        }
            if(cell = document.querySelector(`[data-row="${row}"][data-col="${col+1}"]`)) {
                checkboardRow[3] = row;
                checkboardCol[3] = col+1;
        }
            if(cell = document.querySelector(`[data-row="${row}"][data-col="${col-1}"]`)) {
                checkboardRow[4] = row;
                checkboardCol[4] = col-1;
        }
            if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col}"]`)) {
                checkboardRow[5] = row+1;
                checkboardCol[5] = col;
        }  
    }
        if (text == '王') {
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col}"]`)) {
                checkboardRow[0] = row-1;
                checkboardCol[0] = col; 
        }
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col+1}"]`)) {
                checkboardRow[1] = row-1;
                checkboardCol[1] = col+1;
        }
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col-1}"]`)) {
                checkboardRow[2] = row-1;
                checkboardCol[2] = col-1;
                
        }
            if(cell = document.querySelector(`[data-row="${row}"][data-col="${col+1}"]`)) {
                checkboardRow[3] = row;
                checkboardCol[3] = col+1;
                
        }
            if(cell = document.querySelector(`[data-row="${row}"][data-col="${col-1}"]`)) {
                checkboardRow[4] = row;
                checkboardCol[4] = col-1;
                
        }
            if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col}"]`)) {
                checkboardRow[5] = row+1;
                checkboardCol[5] = col;
        }
            if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col-1}"]`)) {
                checkboardRow[6] = row+1;
                checkboardCol[6] = col-1;
        }
            if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col+1}"]`)) {
                checkboardRow[7] = row+1;
                checkboardCol[7] = col+1;
        }
    }

        if (text == '飛') {
            let j =0;
            let k = 0;
            //上方向
            for(let i=0; i<row; i++) {
                const cell = document.querySelector(`[data-row="${row-i-1}"][data-col="${col}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i] = row-i-1;
                checkboardCol[0+i] = col;
                j++;
                break;
                }
                checkboardRow[0+i] = row-i-1;
                checkboardCol[0+i] = col;
                j++;
            }
            k=k+j;
            j=0;
            //下方向
            for(let i=0; i<8-row; i++) {
                const cell = document.querySelector(`[data-row="${row+i+1}"][data-col="${col}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i+k] = row+i+1;
                checkboardCol[0+i+k] = col;
                j++;
                break;
                }
                checkboardRow[0+i+k] = row+i+1;
                checkboardCol[0+i+k] = col;
                j++;
            }
            k=k+j;
            j=0;
            //右方向
            for(let i=0; i<8-col; i++) {
                const cell = document.querySelector(`[data-row="${row}"][data-col="${col+i+1}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i+k] = row;
                checkboardCol[0+i+k] = col+i+1;
                j++;
                break;
                }
                checkboardRow[0+i+k] = row;
                checkboardCol[0+i+k] = col+i+1;
                j++;
        }
        k=k+j;
        j=0;
            //左方向
            for(let i=0; i<col; i++) {
                const cell = document.querySelector(`[data-row="${row}"][data-col="${col-i-1}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i+k] = row;
                checkboardCol[0+i+k] = col-i-1;
                j++;
                break;
                }
                checkboardRow[0+i+k] = row;
                checkboardCol[0+i+k] = col-i-1;
                j++;
            }
        }   
    if (text == '角') {
        let j = 0;
        let k=0;
            //右上方向
            for(let i =0; i < row && i < 8-col; i++) {
                const cell = document.querySelector(`[data-row="${row-i-1}"][data-col="${col+i+1}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i] = row-i-1;
                checkboardCol[0+i] = col+i+1;
                j++;
                break;
                }
                checkboardRow[0+i] = row-i-1;
                checkboardCol[0+i] = col+i+1;
                j++;
            }
        k=k+j;
        j=0;
            //左上方向
            for(let i=0; i < row && i < col; i++) {
                const cell = document.querySelector(`[data-row="${row-i-1}"][data-col="${col-i-1}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i+k] = row-i-1;
                checkboardCol[0+i+k] = col-i-1;
                j++;
                break;
                }
                checkboardRow[0+i+k] = row-i-1;
                checkboardCol[0+i+k] = col-i-1;
                j++;
            }
            k=k+j;
        j=0;
            //右下方向
            for(let i=0; i<8-row && i<8-col; i++) {
                const cell = document.querySelector(`[data-row="${row+i+1}"][data-col="${col+i+1}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i+k] = row+i+1;
                checkboardCol[0+i+k] = col+i+1;
                j++;
                break;
                }
                checkboardRow[0+i+k] = row+i+1;
                checkboardCol[0+i+k] = col+i+1;
                j++;
             }
             k=k+j;
        j=0;
            //左下方向
            for(let i=0; i<8-row && i<col; i++) {
                const cell = document.querySelector(`[data-row="${row+i+1}"][data-col="${col-i-1}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i+k] = row+i+1;
                checkboardCol[0+i+k] = col-i-1;
                
                j++;
                break;
                }
                checkboardRow[0+i+k] = row+i+1;
                checkboardCol[0+i+k] = col-i-1;
                j++;
            }
        }


        if (text == '龍') {
            let j =0;
            let k = 0;
            //上方向
            for(let i=0; i<row; i++) {
                const cell = document.querySelector(`[data-row="${row-i-1}"][data-col="${col}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i] = row-i-1;
                checkboardCol[0+i] = col;
                j++;
                break;
                }
                checkboardRow[0+i] = row-i-1;
                checkboardCol[0+i] = col;
                j++;
            }
            k=k+j;
            j=0;
            //下方向
            for(let i=0; i<8-row; i++) {
                const cell = document.querySelector(`[data-row="${row+i+1}"][data-col="${col}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i+k] = row+i+1;
                checkboardCol[0+i+k] = col;
                j++;
                break;
                }
                checkboardRow[0+i+k] = row+i+1;
                checkboardCol[0+i+k] = col;
                j++;
            }
            k=k+j;
            j=0;
            //右方向
            for(let i=0; i<8-col; i++) {
                const cell = document.querySelector(`[data-row="${row}"][data-col="${col+i+1}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i+k] = row;
                checkboardCol[0+i+k] = col+i+1;
                j++;
                break;
                }
                checkboardRow[0+i+k] = row;
                checkboardCol[0+i+k] = col+i+1;
                j++;
        }
        k=k+j;
        j=0;
            //左方向
            for(let i=0; i<col; i++) {
                const cell = document.querySelector(`[data-row="${row}"][data-col="${col-i-1}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i+k] = row;
                checkboardCol[0+i+k] = col-i-1;
                j++;
                break;
                }
                checkboardRow[0+i+k] = row;
                checkboardCol[0+i+k] = col-i-1;
                j++;
            }
            k=k+j;
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col+1}"]`)) {
                checkboardRow[k] = row-1;
                checkboardCol[k] = col+1;
                k++;
        }
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col-1}"]`)) {
                checkboardRow[k] = row-1;
                checkboardCol[k] = col-1; 
                k++;
        }
            if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col-1}"]`)) {
                checkboardRow[k] = row+1;
                checkboardCol[k] = col-1;
                k++;
        }
            if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col+1}"]`)) {
                checkboardRow[k] = row+1;
                checkboardCol[k] = col+1;
        }
        }   
    if (text == '馬') {
        let j = 0;
        let k=0;
            //右上方向
            for(let i =0; i < row && i < 8-col; i++) {
                const cell = document.querySelector(`[data-row="${row-i-1}"][data-col="${col+i+1}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i] = row-i-1;
                checkboardCol[0+i] = col+i+1;
                j++;
                break;
                }
                checkboardRow[0+i] = row-i-1;
                checkboardCol[0+i] = col+i+1;
                j++;
            }
        k=k+j;
        j=0;
            //左上方向
            for(let i=0; i < row && i < col; i++) {
                const cell = document.querySelector(`[data-row="${row-i-1}"][data-col="${col-i-1}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i+k] = row-i-1;
                checkboardCol[0+i+k] = col-i-1;
                j++;
                break;
                }
                checkboardRow[0+i+k] = row-i-1;
                checkboardCol[0+i+k] = col-i-1;
                j++;
            }
            k=k+j;
        j=0;
            //右下方向
            for(let i=0; i<8-row && i<8-col; i++) {
                const cell = document.querySelector(`[data-row="${row+i+1}"][data-col="${col+i+1}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i+k] = row+i+1;
                checkboardCol[0+i+k] = col+i+1;
                j++;
                break;
                }
                checkboardRow[0+i+k] = row+i+1;
                checkboardCol[0+i+k] = col+i+1;
                j++;
             }
             k=k+j;
        j=0;
            //左下方向
            for(let i=0; i<8-row && i<col; i++) {
                const cell = document.querySelector(`[data-row="${row+i+1}"][data-col="${col-i-1}"]`);
                if(cell.id == 'player0') {
                    break;
                } else if(cell.id == 'player1') {
                checkboardRow[0+i+k] = row+i+1;
                checkboardCol[0+i+k] = col-i-1;
                
                j++;
                break;
                }
                checkboardRow[0+i+k] = row+i+1;
                checkboardCol[0+i+k] = col-i-1;
                j++;
            }
            k=k+j;
            if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col}"]`)) {
                checkboardRow[k] = row-1;
                checkboardCol[k] = col; 
                k++;
        }
            if(cell = document.querySelector(`[data-row="${row}"][data-col="${col+1}"]`)) {
                checkboardRow[k] = row;
                checkboardCol[k] = col+1;
                k++;
        }
            if(cell = document.querySelector(`[data-row="${row}"][data-col="${col-1}"]`)) {
                checkboardRow[k] = row;
                checkboardCol[k] = col-1;
                k++;
        }
            if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col}"]`)) {
                checkboardRow[k] = row+1;
                checkboardCol[k] = col;
        }
        }
    }






//opponent側の駒の動き
if (id == 'player1') {
    if (text == '歩') {
        if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col}"]`)) {
            checkboardRow[0] = row+1;
            checkboardCol[0] = col;
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
        break;
        }
        checkboardRow[0+i] = row+i+1;
        checkboardCol[0+i] = col;
       }
    }
    if (text == '桂') {
        if(cell = document.querySelector(`[data-row="${row+2}"][data-col="${col+1}"]`)) {
        checkboardRow[0] = row+2;
        checkboardCol[0] = col+1;
    }
        if(cell = document.querySelector(`[data-row="${row+2}"][data-col="${col-1}"]`)) {
            checkboardRow[1] = row+2;
            checkboardCol[1] = col-1;
    }
}
    if (text == '銀') {
        if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col}"]`)) {
            checkboardRow[0] = row+1;
            checkboardCol[0] = col;
    }
        if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col-1}"]`)) {
            checkboardRow[1] = row+1;
            checkboardCol[1] = col-1;
    }
        if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col+1}"]`)) {
            checkboardRow[2] = row+1;
            checkboardCol[2] = col+1;
    }
        if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col-1}"]`)) {
            checkboardRow[3] = row-1;
            checkboardCol[3] = col-1;
    }
        if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col+1}"]`)) {
            checkboardRow[4] = row-1;
            checkboardCol[4] = col+1;
    }
}
    if (text == '金' || text == 'と' || text == '圭' || text == '全' || text == '杏') {
        if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col}"]`)) {
            checkboardRow[0] = row+1;
            checkboardCol[0] = col;
    }
        if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col-1}"]`)) {
            checkboardRow[1] = row+1;
            checkboardCol[1] = col-1;
    }
        if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col+1}"]`)) {
            checkboardRow[2] = row+1;
            checkboardCol[2] = col+1;
    }
        if(cell = document.querySelector(`[data-row="${row}"][data-col="${col-1}"]`)) {
            checkboardRow[3] = row;
            checkboardCol[3] = col-1;
    }
        if(cell = document.querySelector(`[data-row="${row}"][data-col="${col+1}"]`)) {
            checkboardRow[4] = row;
            checkboardCol[4] = col+1;
    }
        if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col}"]`)) {
            checkboardRow[5] = row-1;
            checkboardCol[5] = col;
    }  
}
    if (text == '王') {
        if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col}"]`)) {
            checkboardRow[0] = row-1;
            checkboardCol[0] = col;
    }
        if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col+1}"]`)) {
            checkboardRow[1] = row-1;
            checkboardCol[1] = col+1;
    }
        if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col-1}"]`)) {
            checkboardRow[2] = row-1;
            checkboardCol[2] = col-1;
    }
        if(cell = document.querySelector(`[data-row="${row}"][data-col="${col+1}"]`)) {
            checkboardRow[3] = row;
            checkboardCol[3] = col+1;
    }
        if(cell = document.querySelector(`[data-row="${row}"][data-col="${col-1}"]`)) {
            checkboardRow[4] = row;
            checkboardCol[4] = col-1;
    }
        if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col}"]`)) {
            checkboardRow[5] = row+1;
            checkboardCol[5] = col;
    }
        if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col-1}"]`)) {
            checkboardRow[6] = row+1;
            checkboardCol[6] = col-1;
    }
        if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col+1}"]`)) {
            checkboardRow[7] = row+1;
            checkboardCol[7] = col+1;
    }
}
    if (text == '飛') {
        let j = 0;
        let k=0;
        //上方向
        for(let i=0; i<row; i++) {
            const cell = document.querySelector(`[data-row="${row-i-1}"][data-col="${col}"]`);
            if(cell.id == 'player1') {
                break;
            } else if(cell.id == 'player0') {
            checkboardRow[0+i] = row-i-1;
            checkboardCol[0+i] = col;
            j++;
            break;
            }
            checkboardRow[0+i] = row-i-1;
            checkboardCol[0+i] = col;
            j++;
        }
        k=k+j;
        j=0;
        //下方向
        for(let i=0; i<8-row; i++) {
            const cell = document.querySelector(`[data-row="${row+i+1}"][data-col="${col}"]`);
            if(cell.id == 'player1') {
                break;
            } else if(cell.id == 'player0') {
            checkboardRow[0+i+k] = row+i+1;
            checkboardCol[0+i+k] = col;
            j++;
            break;
            }
            checkboardRow[0+i+k] = row+i+1;
            checkboardCol[0+i+k] = col;
            j++;
        }
        k=k+j;
        j=0;
        //右方向
        for(let i=0; i<8-col; i++) {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col+i+1}"]`);
            if(cell.id == 'player1') {
                break;
            } else if(cell.id == 'player0') {
            checkboardRow[0+i+k] = row;
            checkboardCol[0+i+k] = col+i+1;
            j++;
            break;
            }
            checkboardRow[0+i+k] = row;
            checkboardCol[0+i+k] = col+i+1;
            j++;
    }
    k=k+j;
        j=0;
        //左方向
        for(let i=0; i<col; i++) {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col-i-1}"]`);
            if(cell.id == 'player1') {
                break;
            } else if(cell.id == 'player0') {
            checkboardRow[0+i+k] = row;
            checkboardCol[0+i+k] = col-i-1;
            j++;
            break;
            }
            checkboardRow[0+i+k] = row;
            checkboardCol[0+i+k] = col-i-1;
            j++;
        }
    }   
if (text == '角') {
    let j = 0;
    let k=0;
        //右上方向
        for(let i =0; i < row && i < 8-col; i++) {
            const cell = document.querySelector(`[data-row="${row-i-1}"][data-col="${col+i+1}"]`);
            if(cell.id == 'player1') {
                break;
            } else if(cell.id == 'player0') {
            checkboardRow[0+i] = row-i-1;
            checkboardCol[0+i] = col+i+1;
            j++;
            break;
            }
            checkboardRow[0+i] = row-i-1;
            checkboardCol[0+i] = col+i+1;
            j++;
        }
        k=k+j;
        j=0;
        //左上方向
        for(let i=0; i < row && i < col; i++) {
            const cell = document.querySelector(`[data-row="${row-i-1}"][data-col="${col-i-1}"]`);
            if(cell.id == 'player1') {
                break;
            } else if(cell.id == 'player0') {
            checkboardRow[0+i+k] = row-i-1;
            checkboardCol[0+i+k] = col-i-1;
            j++;
            break;
            }
            checkboardRow[0+i+k] = row-i-1;
            checkboardCol[0+i+k] = col-i-1;
            j++;
        }
        k=k+j;
        j=0;
        //右下方向
        for(let i=0; i<8-row && i<8-col; i++) {
            const cell = document.querySelector(`[data-row="${row+i+1}"][data-col="${col+i+1}"]`);
            if(cell.id == 'player1') {
                break;
            } else if(cell.id == 'player0') {
            checkboardRow[0+i+k] = row+i+1;
            checkboardCol[0+i+k] = col+i+1;
            j++;
            break;
            }
            checkboardRow[0+i+k] = row+i+1;
            checkboardCol[0+i+k] = col+i+1;
            j++;
         }
         k=k+j;
        j=0;
        //左下方向
        for(let i=0; i<8-row && i<col; i++) {
            const cell = document.querySelector(`[data-row="${row+i+1}"][data-col="${col-i-1}"]`);
            if(cell.id == 'player1') {
                break;
            } else if(cell.id == 'player0') {
            checkboardRow[0+i+k] = row+i+1;
            checkboardCol[0+i+k] = col-i-1;
            j++;
            break;
            }
            checkboardRow[0+i+k] = row+i+1;
            checkboardCol[0+i+k] = col-i-1;
            j++;
        }
    }


    if (text == '龍') {
        let j = 0;
        let k=0;
        //上方向
        for(let i=0; i<row; i++) {
            const cell = document.querySelector(`[data-row="${row-i-1}"][data-col="${col}"]`);
            if(cell.id == 'player1') {
                break;
            } else if(cell.id == 'player0') {
            checkboardRow[0+i] = row-i-1;
            checkboardCol[0+i] = col;
            j++;
            break;
            }
            checkboardRow[0+i] = row-i-1;
            checkboardCol[0+i] = col;
            j++;
        }
        k=k+j;
        j=0;
        //下方向
        for(let i=0; i<8-row; i++) {
            const cell = document.querySelector(`[data-row="${row+i+1}"][data-col="${col}"]`);
            if(cell.id == 'player1') {
                break;
            } else if(cell.id == 'player0') {
            checkboardRow[0+i+k] = row+i+1;
            checkboardCol[0+i+k] = col;
            j++;
            break;
            }
            checkboardRow[0+i+k] = row+i+1;
            checkboardCol[0+i+k] = col;
            j++;
        }
        k=k+j;
        j=0;
        //右方向
        for(let i=0; i<8-col; i++) {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col+i+1}"]`);
            if(cell.id == 'player1') {
                break;
            } else if(cell.id == 'player0') {
            checkboardRow[0+i+k] = row;
            checkboardCol[0+i+k] = col+i+1;
            j++;
            break;
            }
            checkboardRow[0+i+k] = row;
            checkboardCol[0+i+k] = col+i+1;
            j++;
    }
    k=k+j;
        j=0;
        //左方向
        for(let i=0; i<col; i++) {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col-i-1}"]`);
            if(cell.id == 'player1') {
                break;
            } else if(cell.id == 'player0') {
            checkboardRow[0+i+k] = row;
            checkboardCol[0+i+k] = col-i-1;
            j++;
            break;
            }
            checkboardRow[0+i+k] = row;
            checkboardCol[0+i+k] = col-i-1;
            j++;
        }
        k=k+j;
        if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col+1}"]`)) {
            checkboardRow[k] = row-1;
            checkboardCol[k] = col+1;
            k++;
    }
        if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col-1}"]`)) {
            checkboardRow[k] = row-1;
            checkboardCol[k] = col-1;
            k++;
    }
        if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col-1}"]`)) {
            checkboardRow[k] = row+1;
            checkboardCol[k] = col-1;
            k++;
    }
        if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col+1}"]`)) {
            checkboardRow[k] = row+1;
            checkboardCol[k] = col+1;
    }
    }   
if (text == '馬') {
    let j = 0;
    let k=0;
        //右上方向
        for(let i =0; i < row && i < 8-col; i++) {
            const cell = document.querySelector(`[data-row="${row-i-1}"][data-col="${col+i+1}"]`);
            if(cell.id == 'player1') {
                break;
            } else if(cell.id == 'player0') {
            checkboardRow[0+i] = row-i-1;
            checkboardCol[0+i] = col+i+1;
            j++;
            break;
            }
            checkboardRow[0+i] = row-i-1;
            checkboardCol[0+i] = col+i+1;
            j++;
        }
        k=k+j;
        j=0;
        //左上方向
        for(let i=0; i < row && i < col; i++) {
            const cell = document.querySelector(`[data-row="${row-i-1}"][data-col="${col-i-1}"]`);
            if(cell.id == 'player1') {
                break;
            } else if(cell.id == 'player0') {
            checkboardRow[0+i+k] = row-i-1;
            checkboardCol[0+i+k] = col-i-1;
            j++;
            break;
            }
            checkboardRow[0+i+k] = row-i-1;
            checkboardCol[0+i+k] = col-i-1;
            j++;
        }
        k=k+j;
        j=0;
        //右下方向
        for(let i=0; i<8-row && i<8-col; i++) {
            const cell = document.querySelector(`[data-row="${row+i+1}"][data-col="${col+i+1}"]`);
            if(cell.id == 'player1') {
                break;
            } else if(cell.id == 'player0') {
            checkboardRow[0+i+k] = row+i+1;
            checkboardCol[0+i+k] = col+i+1;
            j++;
            break;
            }
            checkboardRow[0+i+k] = row+i+1;
            checkboardCol[0+i+k] = col+i+1;
            j++;
         }
         k=k+j;
        j=0;
        //左下方向
        for(let i=0; i<8-row && i<col; i++) {
            const cell = document.querySelector(`[data-row="${row+i+1}"][data-col="${col-i-1}"]`);
            if(cell.id == 'player1') {
                break;
            } else if(cell.id == 'player0') {
            checkboardRow[0+i+k] = row+i+1;
            checkboardCol[0+i+k] = col-i-1;
            j++;
            break;
            }
            checkboardRow[0+i+k] = row+i+1;
            checkboardCol[0+i+k] = col-i-1;
            j++;
        }
        k=k+j;
        if(cell = document.querySelector(`[data-row="${row-1}"][data-col="${col}"]`)) {
            checkboardRow[k] = row-1;
            checkboardCol[k] = col;
            k++;
    }
        if(cell = document.querySelector(`[data-row="${row}"][data-col="${col+1}"]`)) {
            checkboardRow[k] = row;
            checkboardCol[k] = col+1;
            k++;
    }
        if(cell = document.querySelector(`[data-row="${row}"][data-col="${col-1}"]`)) {
            checkboardRow[k] = row;
            checkboardCol[k] = col-1;
            k++;
    }
        if(cell = document.querySelector(`[data-row="${row+1}"][data-col="${col}"]`)) {
            checkboardRow[k] = row+1;
            checkboardCol[k] = col;
            k++;
    }
    }
}
for(let i =0 ; i< checkboardRow.length ; i++) {
    for(let j =0; j<checkboardCol.length; j++) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (possiblecell = document.querySelector(`[data-row="${checkboardRow[i]}"][data-col="${checkboardCol[i]}"]`)) {
            if(cell.id == 'player0' && possiblecell.id != 'player0') {
        possiblecell.classList.add('possible');
            } else if(cell.id == 'player1' && possiblecell.id != 'player1') {
                possiblecell.classList.add('possible');
            }
        }
    }
}
}