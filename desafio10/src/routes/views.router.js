import express from "express";
import passport from "passport";
import ViewsController from "../controllers/view.controller.js";
import checkUserRole from "../middleware/checkrole.js";

const router = express.Router();
const viewsController = new ViewsController();

router.get("/products", checkUserRole(['usuario','premium']),passport.authenticate('jwt', { session: false }), viewsController.renderProducts);

router.get("/carts/:cid", viewsController.renderCart);
router.get("/login", viewsController.renderLogin);
router.get("/register", viewsController.renderRegister);
router.get("/realtimeproducts", checkUserRole(['admin','premium']), viewsController.renderRealTimeProducts);
router.get("/chat", checkUserRole(['usuario','premium']), viewsController.renderChat);
router.get("/", viewsController.renderHome);
router.get("/loggertest", viewsController.showLoggerTest) // Logger - Winston

// Desafío Complementario 3:
router.get("/reset-password", viewsController.renderResetPassword);
router.get("/confirmacion-envio", viewsController.renderConfirmacion);
router.get("/password", viewsController.renderCambioPassword);

export default router;