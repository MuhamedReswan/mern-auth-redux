import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";  
import { authUser } from "./controller/userController.js";

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

app.use(morgan("dev"));  

app.use("/api/users", authUser);

app.get("/", (req, res) => res.send("Server is ready"));

app.listen(port, () => console.log(`Server started on port ${port}`));
