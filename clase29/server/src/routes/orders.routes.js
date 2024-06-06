import { Router } from "express";
import { createOrder, getOrderById, getOrders, resolveOrder } from "../controllers/orders.controller.js";

const router = Router();

router.get("/", getOrders);
router.post("/", createOrder);
router.get("/:oid", getOrderById);
router.put("/:oid", resolveOrder);

export { router as ordersRouter };