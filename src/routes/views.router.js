import express from "express";
import passport from "passport";
import ViewsController from "../controllers/view.controller.js";
import checkUserRole from "../middleware/checkrole.js";

const router = express.Router();
const viewsController = new ViewsController();

router.get("/", viewsController.renderHome); // renderiza la interfaz principal
router.get("/register", viewsController.renderRegister); // renderiza el registro
router.get("/login", viewsController.renderLogin); // renderiza el login
router.get("/profile", passport.authenticate("jwt", { session: false }), viewsController.renderProfile); // renderiza profile, pasando datos del usuario
router.get("/reset-password", viewsController.renderResetPassword); // renderiza la interfaz de ingreso de mail para cambiar la contraseña
router.get("/confirmacion-envio", viewsController.renderConfirmacion); // renderiza la interfaz de confirmacion de envío del mail para cambiar la contraseña
router.get("/password", viewsController.renderCambioPassword); // renderiza la interfaz de cambio de contraseña
router.get("/chat", checkUserRole(['usuario','premium']), viewsController.renderChat); // renderiza el chat
router.get("/products", checkUserRole(['usuario','premium']),passport.authenticate('jwt', { session: false }), viewsController.renderProducts); // renderiza los productos en la tienda
router.get("/carts/:cid", viewsController.renderCart); // renderiza el carrito
router.get("/realtimeproducts", checkUserRole(['admin','premium']), viewsController.renderRealTimeProducts); // renderiza los productos en modify
router.get("/loggertest", viewsController.showLoggerTest) // logger - winston
router.get("/adminusers", checkUserRole(['admin']), viewsController.adminUsers) // visualizar, modificar rol y eliminar usuarios

export default router;