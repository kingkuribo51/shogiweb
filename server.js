const express = require('express');
const http = require('http');
const { disconnect } = require('process');
const socketIo = require('socket.io');

// Expressのセットアップ
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

//状態保存
let savepieces = [[[]]];
let savemypieces = [[]];
let saveopponent_pieces = [[]];
let savequeryId = [[]];
let savemyId = [[]];
let saveoopoId = [[]];
let save = -1;
let connect = 0;
let yb=0;
let yt =0;
let nb = 0;
let nt = 0;
let resetyes =0;
let resetno = 0;
let players = [];
let turn = 0;
let saveselectRow = [];
let saveselectCol = [];
let savemoveRow = [];
let savemovetCol = [];
let saveplayer = [];
let saveselectcatch = [];


// 静的ファイルを提供
app.use(express.static('public'));

//ejs path定義
app.set('view engine', 'ejs');


// ルートでHTMLをレンダリング
app.get('/', (req, res) => {
    res.render('index.ejs');
});

// Socket.IOの接続処理
io.on('connection', (socket) => {
    console.log('ユーザーが接続しました');
    if(players.length >= 2) {
        socket.emit('full');
        socket.disconnect();
        return;
    }
    players.push(socket);
    console.log(players.length);
    
    if(players.length ==2) {
        if(savepieces.length == 1) {
        io.emit('start');
        }
        players[0].emit('playnumber', 0);
        players[1].emit('playnumber', 1);
        players[turn].emit('turn');
        players[(turn + 1) % 2].emit('notturn');
        if(savepieces.length > 1) {
            io.emit('receve', {pieces:savepieces[save], mine:savemypieces[save], yours: saveopponent_pieces[save], myId: savemyId[save], oppoId: saveoopoId[save], boardId: savequeryId[save], player: saveplayer[save], selectcatch: saveselectcatch[save],selectRow: saveselectRow[save], selectCol: saveselectCol[save], moveRow: savemoveRow[save], moveCol: savemovetCol[save]});
            players[turn].emit('turn');
            players[(turn + 1) % 2].emit('notturn');
        }
    }

     // 駒の移動
socket.on('pieces', (data) => {
    save++;
    io.emit('receve', (data));
    savepieces[save] = data.pieces;
    savemypieces[save] = data.mine;
    saveopponent_pieces[save] = data.yours;
    savequeryId[save] = data.boardId
    saveoopoId[save] = data.oppoId;
    savemyId[save] = data.myId;
    saveselectRow[save] = data.selectRow;
    saveselectCol[save] = data.selectCol;
    savemoveRow[save] = data.moveRow;
    savemovetCol[save] = data.moveCol;
    saveplayer[save] = data.player;
    saveselectcatch[save] = null;
    
    turn = (turn + 1) % 2;
    resetno = 0;
    nb = 0;
    nt = 0;
    console.log(turn);
    players[turn].emit('turn');
    players[(turn + 1) % 2].emit('notturn');
});

socket.on('sasipieces', (data) => {
    save++;
    io.emit('receve', (data));
    savepieces[save] = data.pieces;
    savemypieces[save] = data.mine;
    saveopponent_pieces[save] = data.yours;
    savequeryId[save] = data.boardId
    saveoopoId[save] = data.oppoId;
    savemyId[save] = data.myId;
    saveselectRow[save] = null;
    saveselectCol[save] = null;
    savemoveRow[save] = data.moveRow;
    savemovetCol[save] = data.moveCol;
    saveplayer[save] = data.player;
    saveselectcatch[save] = data.selectcatch;
    
    turn = (turn + 1) % 2;
    resetno = 0;
    nb = 0;
    nt = 0;
    console.log(turn);
    players[turn].emit('turn');
    players[(turn + 1) % 2].emit('notturn');
});

socket.on('boardswitch', (data) => {
    io.emit('haveC', {name: data, function: "boardswitch"})
});
socket.on('switchB', (data) => {
    if(data == 'yes') {
    yb++;
    } else if(data == 'cancel') {
        nb++;
    }
    if(yb == 2) {
        players[1].emit('playnumber', 0);
        players[0].emit('playnumber', 1);
        yb=0;
    } else if(nb > 0) {
        yb = 0;
        io.emit('Bdisabled');
    }
});

socket.on('turnswitch', (data) => {
    io.emit('haveC', {name: data, function: 'turnswitch'});
});
socket.on('switchT', (data) => {
    if(data == 'yes') {
    yt++;
    } else if(data == 'cancel') {
        nt++;
    }
    if(yt == 2) {
        turn = (turn + 1) % 2;
        players[(turn + 1) % 2].emit('notturn');
        players[turn].emit('turn');
        yt=0;
    } else if(nt > 0) {
        yt = 0;
        io.emit('Tdisabled');
    }
});

socket.on('stock', () => {
    if(save > 0) {
    save--;
    io.emit('receve', {pieces:savepieces[save], mine:savemypieces[save], yours: saveopponent_pieces[save], myId: savemyId[save], oppoId: saveoopoId[save], boardId: savequeryId[save], player: saveplayer[save], selectcatch: saveselectcatch[save],selectRow: saveselectRow[save], selectCol: saveselectCol[save], moveRow: savemoveRow[save], moveCol: savemovetCol[save]});
    turn = (turn + 1) % 2;
    players[turn].emit('turn');
    players[(turn + 1) % 2].emit('notturn');
    
    }
});

    // ユーザーが切断した場合
    socket.on('disconnect', () => {
        console.log('ユーザーが切断しました');
        io.emit('rere');
        players = players.filter((playerSocket) => playerSocket.id !== socket.id);
    });

    socket.on('nakatugi', () => {
        io.emit('reset');
        console.log("nakatugi");
    });

    socket.on('reset', (data) => {
        if(data == true) {
            resetyes++;
        } else if(data == false) {
            resetno++;
        }
        if(resetyes == 2) {
            savepieces = [[[]]];
            savemypieces = [[]];
            saveopponent_pieces = [[]];
            savequeryId = [[]];
            savemyId = [[]];
            saveoopoId = [[]];
            saveselectRow = [];
            saveselectCol = [];
            savemoveRow = [];
            savemovetCol = [];
            save = -1;
            yb=0;
            yt =0;
            nb = 0;
            nt = 0;
            resetyes =0;
            resetno = 0;
            connect  = 1;
            turn = 0;
        io.emit('reload');
        } else if(resetno > 0){
            resetyes = 0;
        }
});

socket.on('winlose', () => {
    console.log("winlose");
    socket.emit('win');
    socket.broadcast.emit('lose');
});

});



// サーバーを指定したポートで起動
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`サーバーがポート${PORT}で起動しました`));
