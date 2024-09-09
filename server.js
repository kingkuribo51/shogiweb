const express = require('express');
const http = require('http');
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

// 静的ファイルを提供
app.use(express.static('public'));

//ejs path定義
app.set('view engine', 'ejs');


// ルートでHTMLをレンダリング
app.get('/', (req, res) => {
    res.render('index.ejs');
});

let players = [];
let turn = 0;

// Socket.IOの接続処理
io.on('connection', (socket) => {
    console.log('ユーザーが接続しました');
    players.push(socket);
    
    if(players.length ==2) {
        if(savepieces.length == 1) {
        io.emit('start');
        }
        players[0].emit('playnumber', 0);
        players[1].emit('playnumber', 1);
        if(savepieces.length > 1) {
            console.log(savepieces.length);
            console.log(savepieces);
            io.emit('receve', {pieces:savepieces[save], mine:savemypieces[save], yours: saveopponent_pieces[save], myId: savemyId[save], oppoId: saveoopoId[save], boardId: savequeryId[save]});
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
    console.log("stock",save);
    console.log(savepieces[save]);
    
    turn = (turn + 1) % 2;
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
        nb = 0;
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
        nt = 0;
    }
});

socket.on('stock', () => {
    if(save > 0) {
    save--;
    io.emit('receve', {pieces:savepieces[save], mine:savemypieces[save], yours: saveopponent_pieces[save], myId: savemyId[save], oppoId: saveoopoId[save], boardId: savequeryId[save]});
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
        if(players.length == 0) {
        savepieces = [[[]]];
        savemypieces = [[]];
        saveopponent_pieces = [[]];
        savequeryId = [[]];
        savemyId = [[]];
        saveoopoId = [[]];
        save = -1;
        connect =0;
        }
    });
});

// サーバーを指定したポートで起動
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`サーバーがポート${PORT}で起動しました`));
