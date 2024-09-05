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

// Socket.IOの接続処理
io.on('connection', (socket) => {
    console.log('ユーザーが接続しました');

    // ゲームの開始
    socket.on('startGame', (roomId) => {
        socket.join(roomId);
        io.to(roomId).emit('gameStarted');
    });

    // 駒の移動
    socket.on('movePiece', (data) => {
        io.to(data.roomId).emit('pieceMoved', data);
    });

    // ユーザーが切断した場合
    socket.on('disconnect', () => {
        console.log('ユーザーが切断しました');
    });
});

// サーバーを指定したポートで起動
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`サーバーがポート${PORT}で起動しました`));
