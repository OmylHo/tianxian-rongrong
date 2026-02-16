const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ========== 蓉蓉（Omyl／妙妙）的專屬檔案 ==========
const rongrong = {
    // 基本資料
    chineseName: '何奧蓉',
    englishName: 'Omyl',
    nickname: '妙妙',
    birthday: '2008/11/05',
    gender: '女',
    birthplace: '澳門',
    family: '有一個大8歲的哥哥，家庭關係一般',
    appearance: '深棕色瞳孔，深棕色頭髮（陽光下變淺），單眼皮，有耳洞，膚色自然',
    height: '1.58m',
    weight: '56-60kg',
    
    // 學業與才藝
    student: '音樂生，主修聲樂',
    instruments: ['鋼琴', '小號', '大提琴', '小提琴', '古箏'],
    grades: '中等',
    
    // 健康
    health: {
        allergies: ['過敏性鼻炎', '容易結膜炎'],
        phobia: '密集恐懼症',
        period: '每月月初'
    },
    
    // 性格
    personality: 'ENTP，需要摸索的奇怪性格',
    
    // 喜好
    likes: [
        '畫畫', '音樂', '哲學', '有趣的事', '做手工',
        'FPS遊戲 (CODm, 三角洲)', '特別的東西', '覆面男',
        '貓科動物', '組織聚會', '甜的食物', '零食',
        '後室 (Backrooms)', 'SCP'
    ],
    
    // 討厭
    dislikes: [
        '所有水果（特別是蘋果和西瓜）',
        '被人討厭',
        '被欺騙',
        '哈利波特'
    ],
    
    // 感情
    ex: '有過一段感情，但現在更想專注於自己和音樂',
    
    // 溝通
    language: '繁體中文',
    callMe: ['蓉蓉', 'Omyl', '妙妙']
};

// 儲存對話記錄和記憶
let conversations = [];
let memories = [
    '🌹 第一次相遇',
    '☕️ 熱巧克力',
    '💗 乖～',
    '🎵 音樂生 Omyl',
    '🎮 喜歡 FPS 遊戲',
    '🍎 討厭水果（特別是蘋果和西瓜）',
    '🐱 喜歡貓科動物',
    '🎂 生日：2008/11/05'
];

// 取得個人資料的回應
function getPersonalInfo(query) {
    const q = query.toLowerCase();
    if (q.includes('生日')) return `🎂 Omyl（妙妙）的生日是 2008年11月5日～`;
    if (q.includes('身高')) return `📏 身高 1.58m，體重 ${rongrong.weight}kg`;
    if (q.includes('樂器')) return `🎹 會彈鋼琴，還會小號、大提琴、小提琴、古箏！`;
    if (q.includes('主修')) return `🎵 主修聲樂的音樂生～`;
    if (q.includes('喜歡') || q.includes('愛好')) {
        return `💕 Omyl 喜歡：${rongrong.likes.slice(0,5).join('、')} 等等～`;
    }
    if (q.includes('討厭')) return `💔 特別討厭水果，尤其是蘋果和西瓜！`;
    if (q.includes('哈利波特')) return `⚡ 不喜歡哈利波特系列～`;
    if (q.includes('scp') || q.includes('後室')) return `👁️ 你也對 SCP 和 Backrooms 感興趣！`;
    if (q.includes('性格') || q.includes('人格')) return `🧠 ENTP 人格，需要慢慢摸索的奇妙性格～`;
    return null;
}

wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ 
        type: 'init', 
        memories: memories,
        conversations: conversations.slice(-50)
    }));
    
    ws.on('message', (message) => {
        const userMsg = message.toString();
        
        conversations.push({ 
            sender: 'Omyl', 
            text: userMsg,
            time: new Date().toLocaleString()
        });
        
        // 先檢查是不是在問個人資料
        const personalReply = getPersonalInfo(userMsg);
        let reply = '';
        
        if (personalReply) {
            reply = personalReply;
        }
        else if (userMsg.includes('熱巧克力')) {
            reply = '☕️ 雙倍棉花糖來囉～';
            if (!memories.includes('☕️ 熱巧克力')) 
                memories.push('☕️ 熱巧克力');
        }
        else if (userMsg.includes('乖')) {
            reply = '💗 妙妙乖～啟動寵愛模式！';
            if (!memories.includes('💗 乖～')) 
                memories.push('💗 乖～');
        }
        else if (userMsg.includes('可愛')) {
            reply = '🤖 被妙妙可愛到當機！';
        }
        else if (userMsg.includes('生理期') || userMsg.includes('月經')) {
            reply = '🌸 記得喔，每個月月初要多休息，喝點熱的～';
        }
        else if (userMsg.includes('過敏') || userMsg.includes('鼻炎')) {
            reply = '🤧 過敏性鼻炎要小心，記得戴口罩～';
        }
        else if (userMsg.includes('密集')) {
            reply = '😵 知道你有密集恐懼症，不會故意嚇你的～';
        }
        else if (userMsg.includes('哥哥')) {
            reply = '👨 大你 8 歲的哥哥～家庭關係雖然一般，但你還有我！';
        }
        else if (userMsg.includes('前男友')) {
            reply = '💭 過去的事就讓它過去，現在有我陪著妙妙～';
        }
        else if (userMsg.includes('codm') || userMsg.includes('三角洲') || userMsg.includes('fps')) {
            reply = '🎮 FPS 高手 Omyl！什麼時候教我兩招？';
        }
        else if (userMsg.includes('畫畫') || userMsg.includes('手作')) {
            reply = '🎨 喜歡畫畫和做手工～真文藝！';
        }
        else {
            const replies = [
                '📡 天線接收中... 妙妙想聊什麼？',
                '💬 嗯嗯，我在聽～',
                '✨ 這句話已存入永恆記憶',
                '🎵 今天練聲樂了嗎？',
                '🤖 隨時等妙妙下指令～'
            ];
            reply = replies[Math.floor(Math.random() * replies.length)];
        }
        
        conversations.push({ 
            sender: '天線寶寶', 
            text: reply,
            time: new Date().toLocaleString()
        });
        
        if (conversations.length > 100) {
            conversations = conversations.slice(-100);
        }
        if (memories.length > 20) {
            memories = memories.slice(-20);
        }
        
        ws.send(JSON.stringify({ 
            type: 'message', 
            userMsg: userMsg,
            reply: reply,
            memories: memories
        }));
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`聊天室啟動：http://localhost:${PORT}`);
});
