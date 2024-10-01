import { connectToDatabase, closeConnectionToDatabase } from "../utils/dbConnection.js";
//ERROR MESSAGES HERE
//GET all messages
export async function getAllMessages() {
  const database = await connectToDatabase();
  const messagesCollection = database.collection("messages");
  try {
    // Get all messages
    const allMessages = await messagesCollection.find({}).toArray();
    if (allMessages.length > 0) {
      return allMessages;
    } else {
      console.log("There are no messages");
      return [];
    }
  } catch (error) {
    console.error("Failed to get messages:", error);
    return [];
  } finally {
    await closeConnectionToDatabase();
  }
}

//CREATE (save) a new message
export async function createMessage(message) {
  const database = await connectToDatabase();
  try {
    await database.collection("messages").insertOne(message);
    return message;
  } catch (error) {
    console.error("Failed to save the message:", error);
  } finally {
    await closeConnectionToDatabase();
  }
}

//DELETE all messages
export async function deleteAllMessages() {
  const database = await connectToDatabase();
  try {
    const result = await database.collection("messages").deleteMany({});
    console.log(`Deleted ${result.deletedCount} messages`);
  } catch (error) {
    console.error("Failed to delete messages:", error);
  } finally {
    await closeConnectionToDatabase();
  }
}
