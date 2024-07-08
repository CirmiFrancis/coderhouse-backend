import express from "express";
import CartController from "../controllers/cart.controller.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();
const cartController = new CartController();

router.use(authMiddleware);

router.post("/", cartController.nuevoCarrito);
router.get("/:cid", cartController.obtenerProductosDeCarrito);
router.post("/:cid/product/:pid", cartController.agregarProductoEnCarrito);
router.delete('/:cid/product/:pid', cartController.eliminarProductoDeCarrito);
router.put('/:cid', cartController.actualizarProductosEnCarrito);
router.put('/:cid/product/:pid', cartController.actualizarCantidad);
router.delete('/:cid', cartController.vaciarCarrito);
router.post('/:cid/purchase', cartController.finalizarCompra);

export default router;