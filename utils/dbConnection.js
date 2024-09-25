import { MongoClient, ServerApiVersion } from "mongodb";
const uri = "mongodb://localhost:27017";
//connect to db
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log("Connected to db");
  } catch (error) {
    console.error("Couldn't connect to db", error);
  }
  return client.db("MrDuck");
};

const closeConnectionToDatabase = async () => {
  if (client) {
    await client.close();
    console.log("Disconnected from database");
  }
};

export { connectToDatabase, closeConnectionToDatabase };
