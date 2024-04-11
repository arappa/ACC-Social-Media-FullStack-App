import express from "express";
import cors from "cors";
import postRouter from "./routes/posts.js";
import userRouter from "./routes/users.js";
import dotenv from 'dotenv';
import dbClient from "./connection.js";

dotenv.config();

// console.log(process.env);

const app = express();

app.use(cors());
app.use(express.json());
app.use("/posts", postRouter);
app.use("/users", userRouter);

try {
    await dbClient.connect();
    await dbClient.db("accsns").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
} catch(err) {
    console.error(err);
}

let db = dbClient.db("accsns");

const PORT = process.env.PORT || 5050;
app.listen(PORT, (error) => { 
	if(!error){
        console.log("Server is Successfully Running, and App is listening on port "+ PORT);
    } 
	else {
		console.log("Error occurred, server can't start", error); 
	} 
}); 

export default db;
