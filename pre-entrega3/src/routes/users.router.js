import express from "express";
const router = express.Router(); 

import UserController from "../controllers/users.controller.js";
const userController = new UserController();

// Genero un usuario y lo almaceno en MongoDB: 
router.post("/", userController.register);

export default router; 