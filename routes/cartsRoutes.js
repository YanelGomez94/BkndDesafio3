import { Router } from "express";
import CartManager from '../src/CartManager.js'

const router = Router()
const manager = new CartManager('../src/carrito.json')


router.get('/:cid', async (req, res) => {
    try {
        const idCart = parseInt(req.params.cid);
        
        // Validar que idCart sea un número entero válido
        if (isNaN(idCart)) {
            return res.status(400).send({ status: "Error", error: "Invalid cart ID" });
        }

        const cart = await manager.getCartById(idCart);
        
        // Si el carrito no se encuentra, enviar una respuesta con código 404
        if (cart === null) {
            return res.status(404).send({ status: "Error", error: "Cart not found" });
        }

        // Enviar el carrito como respuesta
        res.send(cart);
    } catch (error) {
        // En caso de cualquier otro error, enviar una respuesta con código 400
        res.status(400).send({ status: "Error", error: "Failed to retrieve shopping cart" });
    }
});


router.post('/', async(req,res)=>{
    try{
        const addCart = await manager.createCart()
        if(addCart !== null){
            res.status(200).send({status:"Ok",message:"Cart added successfully"})
        }else{
            res.status(400).send({status:"Error", error: "Failed to add cart"})
        }

    }catch(error){
        res.status(400).send({status:"Error", error: "Failed to add shopping cart"})
    }
})

router.post('/:cid/product/:pid', async(req,res)=>{
    try{
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const updatedCart = await manager.addProductToCart(cartId,productId)
        if (updatedCart !== null) {
            res.status(200).send({status:"Ok",message:"Product added successfully to cart"})
        } else {
            res.status(400).send({status:"Error", error: "Failed to product to cart"})
        }
    }catch(error){
        res.status(400).send({status:"Error", error: "Failed to add products to the shopping cart"})
    }
})
export default router;