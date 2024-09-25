import cors from "cors";
import express from "express";

//import routers here
import messagesRouters from "../routers/messagesRouters.js";
const app = express();
const port = 3000;
//to make express be able to read json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//import and enable cors
app.use(cors());

// Use user router
app.use("/messages", messagesRouters);

app.listen(port, () => {
  console.log(`Server listening to port ${port}`);
});
