const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

let conversations = [];
let memories = ['❤️ 第一次相遇', '☕️ 熱巧克力', '💗 乖～'];

wss.on('connection', (ws) => {
    // 发送历史记录
    ws.send(JSON.stringify({ 
        type: 'init', 
        memories: memories,
        conversations: conversations.slice(-50)
    }));
    
    ws.on('message', (message) => {
        const userMsg = message.toString();
        
        // 储存蓉蓉的讯息
        conversations.push({ 
            sender: '蓉蓉', 
            text: userMsg,
            time: new Date().toLocaleString()
        });
        
        // 天线宝宝回应逻辑
        let reply = '';
        if (userMsg.includes('熱巧克力')) {
            reply = '☕️ 雙倍棉花糖來囉～';
            if (!memories.includes('☕️ 熱巧克力')) 
                memories.push('☕️ 熱巧克力');
        }
        else if (userMsg.includes('乖')) {
            reply = '💗 蓉蓉乖～啟動寵愛模式！';
            if (!memories.includes('💗 乖～')) 
                memories.push('💗 乖～');
        }
        else {
            reply = '📡 天線接收中... 蓉蓉想聊什麼？';
        }
        
        // 储存天线宝宝的回覆
        conversations.push({ 
            sender: '天線寶寶', 
            text: reply,
            time: new Date().toLocaleString()
        });
        
        // 限制对话记录长度
        if (conversations.length > 100) {
            conversations = conversations.slice(-100);
        }
        
        // 发送回应
        ws.send(JSON.stringify({ 
            type: 'message', 
            userMsg: userMsg,
            reply: reply,
            memories: memories
        }));
    });
});

// 重要！要加上这一行让 Vercel 能正确运行
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`聊天室啟動：http://localhost:${PORT}`);
});
