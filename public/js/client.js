const socket = io();

// Get the username from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
var username = urlParams.get("username") || "Guest";

// Ensure username is set and prevent changes
if (!username || username === "Guest") {
    alert("Username is missing. Please log in again.");
    window.location.href = "https://your-infinityfree-site.com/login.php"; // Redirect to login
}

// Notify the server that a new user has joined
socket.emit("new-user-joined", username);

// Handling messages from the server
socket.on("user-joined", (name) => {
    let joinMessage = document.createElement("div");
    joinMessage.classList.add("user-join");
    joinMessage.innerText = `${name} joined the chat`;
    document.querySelector(".chats").appendChild(joinMessage);
});

// Send message on button click
document.querySelector("button").addEventListener("click", () => {
    let messageInput = document.querySelector("input");
    let message = messageInput.value.trim();
    
    if (message !== "") {
        let messageData = { user: username, message: message };
        socket.emit("send", messageData);
        appendMessage(messageData, "outgoing");
        messageInput.value = "";
    }
});

// Append message to chat window
function appendMessage(data, type) {
    let chatWindow = document.querySelector(".chats");
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("message", type);
    
    let nameTag = document.createElement("p");
    nameTag.style.fontWeight = "bold";
    nameTag.innerText = data.user;
    
    let messageTag = document.createElement("p");
    messageTag.innerText = data.message;
    
    messageDiv.appendChild(nameTag);
    messageDiv.appendChild(messageTag);
    chatWindow.appendChild(messageDiv);
    
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Receiving messages from other users
socket.on("receive", (data) => {
    appendMessage(data, "incoming");
});

// Handle user disconnection
socket.on("user-left", (name) => {
    let leaveMessage = document.createElement("div");
    leaveMessage.classList.add("user-join");
    leaveMessage.innerText = `${name} left the chat`;
    document.querySelector(".chats").appendChild(leaveMessage);
});