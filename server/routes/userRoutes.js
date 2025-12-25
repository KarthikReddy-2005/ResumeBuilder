import express from "express";
import {
  getUserById,
  getUserResumes,
  LoginUser,
  registerUser,
} from "../controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";

const UserRouter = express.Router();

UserRouter.post("/register", registerUser);
UserRouter.post("/login", LoginUser);
UserRouter.get("/data", protect, getUserById);
UserRouter.get("/resumes", protect, getUserResumes);

export default UserRouter;
