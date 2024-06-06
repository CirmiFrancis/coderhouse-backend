import { Router } from "express";
import { addProduct, createBusiness, getAllBusinesses, getBusinessById } from "../controllers/business.controller.js";

const router = Router();

router.get("/", getAllBusinesses);
router.post("/", createBusiness);
router.get("/:uid", getBusinessById);
router.put("/:bid/product", addProduct);

export { router as businessesRouter };