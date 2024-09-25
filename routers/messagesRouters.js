import express from "express";
const messagesRouters = express.Router();

//import functions/queries from frontend
import { getAllMessages, createMessage, deleteAllMessages } from "../dbQueries/dbQueries.js";

// middleware that is specific to this router
// const timeLog = (req, res, next) => {
//   console.log("Time: ", new Date().toString());
//   next();
// };
// messagesRouters.use(timeLog);

// define the home page route
messagesRouters.get("/", async (req, res) => {
  try {
    const messages = await getAllMessages();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to get messages" });
  }
});
// define the about route
messagesRouters.post("/", async (req, res) => {
  try {
    const messageBody = req.body;
    const newMessage = await createMessage(messageBody);
    if (newMessage) {
      res.status(201).json(newMessage);
    } else {
      res.status(404).json({ error: "Message not found" });
    }
  } catch (error) {
    console.log("Error saving the message", error);
    res.status(500).json({ error: "Failed to save the message" });
  }
});

messagesRouters.delete("/", async (req, res) => {
  try {
    await deleteAllMessages();
    res.status(200).json({ message: "Messages deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete messages" });
  }
});

export default messagesRouters;
