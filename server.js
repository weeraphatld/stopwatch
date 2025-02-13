const WebSocket = require("ws");

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

let command = "stop";

wss.on("connection", ws => {
    ws.send(JSON.stringify({ command }));

    ws.on("message", message => {
        try {
            const data = JSON.parse(message);
            if (data.command) {
                command = data.command;
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ command }));
                    }
                });
            }
        } catch (error) {
            console.error("Invalid message format", error);
        }
    });
});

console.log(`WebSocket Server running on port ${PORT}`);
