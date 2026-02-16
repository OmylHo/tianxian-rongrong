const ws = new WebSocket('ws://' + window.location.host);
ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.type === 'init') {
        data.conversations.forEach(c => addMessage(c.sender, c.text));
    } else {
        addMessage('蓉蓉', data.userMsg);
        addMessage('天線寶寶', data.reply);
    }
};
function send() {
    const msg = document.getElementById('msg').value;
    ws.send(msg);
    document.getElementById('msg').value = '';
}
function addMessage(sender, text) {
    const chat = document.getElementById('chat');
    chat.innerHTML += `<p><b>${sender}:</b> ${text}</p>`;
}
