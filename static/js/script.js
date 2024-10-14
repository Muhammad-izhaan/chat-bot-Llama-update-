document.addEventListener("DOMContentLoaded", function() {
    const sendButton = document.getElementById("send-button");
    const userInput = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");

    // Automatically send a welcome message on page load
    appendMessage("Chatbot", "Hey there! How can I help you today?", "bot");

    // Add a click event listener to the send button
    sendButton.addEventListener("click", function() {
        const message = userInput.value.trim();
        if (message) {
            appendMessage("User", message, "user");  // Display the user message in the chat
            showTypingIndicator();                    // Show the typing indicator
            userInput.value = "";                     // Clear the input field

            // Send message to the server for processing
            sendMessageToServer(message);
        }
    });

    // Add "Enter" key listener to the input box for sending messages
    userInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            sendButton.click();  // Simulate click on pressing Enter
        }
    });

    function appendMessage(sender, message, type) {
        const messageElement = document.createElement("p");
        messageElement.classList.add("message");
        
        // Add class based on sender
        if (type === "user") {
            messageElement.classList.add("user");
        } else {
            messageElement.classList.add("bot");
        }

        messageElement.textContent = `${sender}: ${message}`;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;  // Scroll to bottom on new message
    }

    function showTypingIndicator() {
        const typingIndicator = document.createElement("div");
        typingIndicator.id = "typing-indicator";
        typingIndicator.innerHTML = `
            <img src="https://cdn-icons-png.flaticon.com/128/4056/4056922.png" alt="Typing..." style="width: 24px; height: 24px; animation: bounce 1s infinite;">
            <span>Chatbot is typing...</span>
        `;
        chatBox.appendChild(typingIndicator);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function removeTypingIndicator() {
        const typingIndicator = document.getElementById("typing-indicator");
        if (typingIndicator) {
            chatBox.removeChild(typingIndicator);
        }
    }

    function sendMessageToServer(message) {
        fetch("/get_response", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            removeTypingIndicator();        // Remove the typing indicator
            appendMessage("Chatbot", data.response, "bot");  // Display the bot's response
        })
        .catch(error => {
            console.error("Error:", error);
            removeTypingIndicator();        // Remove the typing indicator
            appendMessage("Chatbot", "Sorry, I didn't get that. Please try again.", "bot");
        });
    }
});
