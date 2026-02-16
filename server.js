const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

let conversations = [];
let memories = ['🌹 第一次相遇', '☕️ 熱巧克力', '💗 乖～'];

wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ type: 'init', memories, conversations }));
    
    ws.on('message', (message) => {
        const userMsg = message.toString();
        conversations.push({ sender: '蓉蓉', text: userMsg });
        
        let reply = '';
        if (userMsg.includes('熱巧克力')) reply = '☕️ 雙倍棉花糖！';
        else if (userMsg.includes('乖')) reply = '💗 蓉蓉乖～';
        else reply = '📡 天線接收中...';
        
        conversations.push({ sender: '天線寶寶', text: reply });
        ws.send(JSON.stringify({ type: 'message', userMsg, reply, memories }));
    });
});

server.listen(3000, () => {
    console.log('聊天室啟動：http://localhost:3000');
});
