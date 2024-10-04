//Selecting all relevant elements by id
const logo = document.getElementById("logo");
const duckMessage = document.getElementById("duckMessage");
const messagesList = document.getElementById("messagesList");
const textInput = document.getElementById("textInput");
const button = document.getElementById("button");
const toggleHistoryButton = document.getElementById("toggleHistoryButton");
const duckHistoryContainer = document.getElementById("duckHistoryContainer");
const clearHistoryButton = document.getElementById("clearHistoryButton");
const duckHistoryHeader = document.getElementById("duckHistoryHeader");
const forceAnswer = document.getElementById("forceAnswer");
const jokeMessage = document.getElementById("jokeMessage");
const stateMessage = document.getElementById("stateMessage");
const editMessageButton = document.querySelector(".editMessageButton");
//function to display the duck message
const displayHidden = () => {
  duckMessage.classList.remove("hidden");
  duckMessage.classList.add("visible");
};

//function to hide the duck message
const hideDisplayed = () => {
  duckMessage.classList.remove("visible");
  duckMessage.classList.add("hidden");
};

//this is querying an api
//get a joke as an aswer
async function fetchJoke() {
  const response = await fetch("https://v2.jokeapi.dev/joke/Any?type=single");
  const jokeObject = await response.json();
  return jokeObject;
}

const displayAnswer = async () => {
  jokeMessage.textContent = "";
  const jokeObject = await fetchJoke();
  const newJoke = document.createElement("p");
  newJoke.textContent = jokeObject.joke;
  jokeMessage.appendChild(newJoke);
};

//adding event listeners to display or hide the message on mouse over and out
logo.addEventListener("mouseover", displayHidden);
logo.addEventListener("mouseout", hideDisplayed);
forceAnswer.addEventListener("click", displayAnswer);
let newMessage;

//fetch request to save message to the db
async function createMessageRequest() {
  newMessage = {
    textMessage: textInput.value,
    date: new Date().toLocaleString([], {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: undefined,
    }),
  };
  //send request to backend using the endpoint for messages
  const response = await fetch("http://localhost:3001/messages", {
    method: "POST",
    body: JSON.stringify(newMessage),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const addedMessageObject = await response.json();
  stateMessage.textContent = "Creating your message...";
  setTimeout(() => {
    showMessage(addedMessageObject);
    stateMessage.textContent = "";
  }, 1500);
  //error handling here
  console.log("addedMessageObject", addedMessageObject);

  return addedMessageObject;
}
//get all messages fetch
const getAllMessagesRequest = async () => {
  const response = await fetch("http://localhost:3001/messages");
  const allMessages = await response.json();
  console.log("allMessages", allMessages);
  return allMessages;
};

//on load - load messages
const loadMessages = async () => {
  console.log("showing messages");
  const allMessages = await getAllMessagesRequest();
  console.log(allMessages);
  // Check if we received an array
  if (allMessages.length >= 1) {
    allMessages.forEach((message) => {
      showMessage(message);
    });
  } else if (allMessages.length === 1) {
    showMessage(message);
  } else {
    console.log("no messages here");
    duckHistoryHeader.textContent = "There are no messages here";
    await showMessage();
  }
};

//show message - singular
const showMessage = async (message) => {
  if (message) {
    duckHistoryHeader.textContent = "What you have told Mr Duck so far:";
    let temp = document.getElementById("messageTemplate");
    let clone = temp.content.cloneNode(true);
    const messageField = clone.querySelector(".message");
    const dateField = clone.querySelector(".timeStamp");
    messageField.textContent = message.textMessage;
    dateField.textContent = message.date;
    document.getElementById("messagesContainer").appendChild(clone);

    editMessageButton.addEventListener("click", editMessage);
  } else {
    console.log("no messages");
    document.getElementById("messagesContainer").textContent = "";
  }
};

const editMessage = () => {
  const input = document.createElement("input");
  input.type = "text";
  input.value = message.textMessage;
  input.classList.add("edit-input");
  // Replace the message text with the input field
  messageElement.replaceWith(input);
  // Handle saving the edited message when user presses Enter or clicks outside
  const saveMessage = () => {
    message.textMessage = input.value; // Update the message object
    messageElement.textContent = message.textMessage; // Update the DOM
    input.replaceWith(messageElement); // Replace input back with message text

    // Optionally, send the updated message to the backend here
    // Example: await saveUpdatedMessage(message);
  };
  // Save on 'Enter' key press
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      saveMessage();
    }
  });
  // Save on losing focus (clicking outside)
  input.addEventListener("blur", () => {
    saveMessage();
  });
  // Focus on the input field when created
  input.focus();
};

const clearHistory = async () => {
  //DELETES ALL MESSAGES
  try {
    const response = await fetch("http://localhost:3001/messages", {
      method: "DELETE",
    });
    // Check if the response is OK (status code in the range 200-299)
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    stateMessage.textContent = "Deleting history...";
    setTimeout(async () => {
      const serverFeedback = await response.json();
      console.log("serverFeedback", serverFeedback);
      stateMessage.textContent = "";
      await loadMessages();
      return serverFeedback;
    }, 1500);
  } catch (error) {
    console.error("Error while clearing history:", error);
    throw error; // Rethrow error if needed to be handled by the caller
  }
};

button.addEventListener("click", createMessageRequest);
clearHistoryButton.addEventListener("click", clearHistory);
//on load, display the previously saved messages
window.addEventListener("load", loadMessages);
