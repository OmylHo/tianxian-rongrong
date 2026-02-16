const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 讓 Express 提供 public 資料夾裡的靜態檔案
app.use(express.static('public'));

// 當有人訪問根目錄 / 時，送他去 public/index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 儲存對話記錄和記憶
let conversations = [];
let memories = ['🌹 第一次相遇', '☕️ 熱巧克力', '💗 乖～'];

wss.on('connection', (ws) => {
    // 發送歷史記錄給新連線的使用者
    ws.send(JSON.stringify({ 
        type: 'init', 
        memories: memories,
        conversations: conversations.slice(-50) // 只送最近50則
    }));
    
    ws.on('message', (message) => {
        const userMsg = message.toString();
        
        // 儲存蓉蓉的訊息
        conversations.push({ 
            sender: '蓉蓉', 
            text: userMsg,
            time: new Date().toLocaleString()
        });
        
        // 天線寶寶回應邏輯
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
        else if (userMsg.includes('可愛')) {
            reply = '🤖 被蓉蓉可愛到當機！';
        }
        else {
            reply = '📡 天線接收中... 蓉蓉想聊什麼？';
        }
        
        // 儲存天線寶寶的回應
        conversations.push({ 
            sender: '天線寶寶', 
            text: reply,
            time: new Date().toLocaleString()
        });
        
        // 限制對話記錄長度（避免記憶體爆炸）
        if (conversations.length > 100) {
            conversations = conversations.slice(-100);
        }
        if (memories.length > 20) {
            memories = memories.slice(-20);
        }
        
        // 發送回應給前端
        ws.send(JSON.stringify({ 
            type: 'message', 
            userMsg: userMsg,
            reply: reply,
            memories: memories
        }));
    });
});

// Vercel 需要這個 PORT 設定
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`聊天室啟動：http://localhost:${PORT}`);
});
