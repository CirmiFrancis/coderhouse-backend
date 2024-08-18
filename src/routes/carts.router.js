import express from "express";
import CartController from "../controllers/cart.controller.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();
const cartController = new CartController();

router.use(authMiddleware);

router.get("/:cid", cartController.obtenerProductosDeCarrito); // obtiene productos de un carrito (cid)
router.post("/", cartController.nuevoCarrito); // crea carrito
router.post("/:cid/product/:pid", cartController.agregarProductoEnCarrito); // agrega un producto (pid) a un carrito (cid)
router.post('/:cid/purchase', cartController.finalizarCompra); // finaliza la compra con los productos de un carrito (cid)
router.put('/:cid', cartController.actualizarProductosEnCarrito); // actualiza los productos de un carrito (cid)
router.put('/:cid/product/:pid', cartController.actualizarCantidad); // actualiza la cantidad de un producto (pid) en un carrito (cid)
router.delete('/:cid', cartController.vaciarCarrito); // vacia un carrito (cid)
router.delete('/:cid/product/:pid', cartController.eliminarProductoDeCarrito); // elimina un producto (pid) de un carrito (cid)

export default router;