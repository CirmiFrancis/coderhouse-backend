import { Router } from "express";
import { createUser, getUserById, getUsers } from "../controllers/users.controller.js";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:uid", getUserById);

export { router as usersRouter };