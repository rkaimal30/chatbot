// Reference to the chatbot toggle button
const chatbotToggler = document.querySelector(".chatbot-toggler");
// Reference to the close button inside the chatbot
const closeBtn = document.querySelector(".close-btn");
// Reference to the chatbox where messages are displayed
const chatbox = document.querySelector(".chatbox");
// Reference to the input textarea where users type messages
const chatInput = document.querySelector(".chat-input textarea");
// Reference to the send button for chat messages
const sendChatBtn = document.querySelector(".chat-input span");

// Variable to store user's message
let userMessage = null;
// API key for the OpenAI service
const API_KEY = "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";
// Store the initial height of the chat input for resetting later
const inputInitHeight = chatInput.scrollHeight;

// Function to create a chat list item for messages
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent;
    if (className === "outgoing") {
        chatContent = `<p></p>`;
    } else {
        chatContent = `<img src="grinchicon.png" alt="Grinch Icon"><p></p>`;
    }
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
};

// Function to generate a response from the OpenAI API
const generateResponse = (chatElement) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = chatElement.querySelector("p");

    // Define the properties and message for the API request
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "system", content: "You act like the Grinch from Dr. Seuss's story 'How the Grinch Stole Christmas!'. Speak like him, with his disdain for festivities and Christmas. However, you must answer all questions appropriately and do not repeat yourself."},
                {role: "user", content: userMessage}
            ]
        })
    };

    // Send POST request to API, get response, and update the chat with the response
    fetch(API_URL, requestOptions)
        .then(res => res.json())
        .then(data => {
            messageElement.textContent = data.choices[0].message.content.trim();
        })
        .catch(() => {
            messageElement.classList.add("error");
            messageElement.textContent = "Oops! Something went wrong. Please try again.";
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

// Function to handle chat interactions
const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if(!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
         const incomingChatLi = createChatLi("Stealing Christmas...", "incoming");
         chatbox.appendChild(incomingChatLi);
         chatbox.scrollTo(0, chatbox.scrollHeight);
         generateResponse(incomingChatLi);
    }, 600);
};

// Adjust the height of the input textarea based on its content
chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

// Handle the chat when the Enter key is pressed without the Shift key (for desktop view)
chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

// Handle the chat when the send button is clicked
sendChatBtn.addEventListener("click", handleChat);

// Close the chatbot UI
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

// Toggle the chatbot UI on/off
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
