import express from "express";
const router = express.Router();

// Renderiza el chat
router.get("/", async (req, res) => {
   res.render("chat");
});

export default router;