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
  const response = await fetch("http://localhost:3000/messages", {
    method: "POST",
    body: JSON.stringify(newMessage),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const addedMessageObject = await response.json();
  console.log("addedMessageObject", addedMessageObject);
  return addedMessageObject;
}
//get all messages fetch
const getAllMessagesRequest = async () => {
  const response = await fetch("http://localhost:3000/messages");
  const allMessages = await response.json();
  console.log("allMessages", allMessages);
  return allMessages;
};

// template example
const showMessages = async () => {
  console.log("showing messages");
  const allMessages = await getAllMessagesRequest();

  // Check if we received an array
  if (Array.isArray(allMessages) && allMessages.length > 0) {
    allMessages.forEach((message) => {
      let temp = document.getElementById("messageTemplate");
      let clone = temp.content.cloneNode(true);
      clone.querySelector(".message").textContent = message.textMessage;
      clone.querySelector(".message").title = message.date;
      document.getElementById("messagesContainer").appendChild(clone);
    });
  } else {
    console.log("There are no messages");
  }
};

const clearHistory = async () => {
  //DELETES ALL MESSAGES
  try {
    // DELETES ALL MESSAGES
    const response = await fetch("http://localhost:3000/messages", {
      method: "DELETE",
    });
    // Check if the response is OK (status code in the range 200-299)
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    const serverFeedback = await response.json();
    console.log("serverFeedback", serverFeedback);
    return serverFeedback;
  } catch (error) {
    console.error("Error while clearing history:", error);
    throw error; // Rethrow error if needed to be handled by the caller
  }
};

button.addEventListener("click", createMessageRequest);
clearHistoryButton.addEventListener("click", clearHistory);
//on load, display the previously saved messages
window.addEventListener("load", showMessages);
