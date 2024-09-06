const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Expressのセットアップ
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

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
        io.emit('start');
        players[turn].emit('turn');
        players[0].emit('playnumber', 0);
        players[1].emit('playnumber', 1);
    }

     // 駒の移動
socket.on('pieces', (data) => {
    io.emit('receve', (data));
    turn = (turn + 1) % 2;
    players[turn].emit('turn');
    players[(turn + 1) % 2].emit('notturn');
});


    // ユーザーが切断した場合
    socket.on('disconnect', () => {
        console.log('ユーザーが切断しました');
        players = players.filter((playerSocket) => playerSocket.id !== socket.id);
    });
});

// サーバーを指定したポートで起動
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`サーバーがポート${PORT}で起動しました`));
