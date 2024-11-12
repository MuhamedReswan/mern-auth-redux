import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import userRoute from "../backend/routes/userRoutes.js";

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

app.use(morgan("dev"));

app.use("/api/users", userRoute);

app.get("/", (req, res) => res.send("Server is ready"));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));