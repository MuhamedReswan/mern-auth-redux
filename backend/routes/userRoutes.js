import express from "express";
const router = express.Router();
import { authUser } from "../controller/userController.js";

router.post("/", authUser);

export default router;
