import { MercadoPagoConfig, Preference } from "mercadopago"; 
import express from "express";

const router = express.Router(); 

// MercadoPago - Lado Servidor
router.post("/create-preference", async (req, res) => {
    try {
        const { cartId, items } = req.body;

        const formattedItems = items.map(item => ({ // productos en el carrito
            title: item.title,
            quantity: item.quantity,
            unit_price: item.price,
            currency_id: "ARS"
        }));

        const body = {
            items: formattedItems,
            back_urls: { // URLs de retorno, modificar en el deploy
                success: `https://saborear.onrender.com/pre-checkout/${cartId}`,
                failure: "https://saborear.onrender.com/error", 
                pending: "https://saborear.onrender.com/profile"
            }, 
            auto_return: "approved", 
        }; 

        const client = new MercadoPagoConfig({accessToken: process.env.MERCADOPAGO_TOKEN}); 
        const preference = new Preference(client); 
        const result = await preference.create({body}); 
        
        res.json({ // se lo enviamos al front
            id: result.id
        })
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: "Error al crear la preferencia" }); 
    }
})

export default router;
