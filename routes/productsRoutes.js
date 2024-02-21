import { Router } from "express";
import { uploader} from '../src/utils.js'
import ProductManager from '../src/ProductManager.js'

const router = Router()
const manager = new ProductManager('../src/productos.json')

router.get('/', async (req, res) => {
    let { limit } = req.query;
    try {
        const products = await manager.getProducts();
        if (limit) {
            const limited = products.slice(0, parseInt(limit));
            res.send({ products: limited });
        } else {
            res.send({ products });
        }
    } catch (error) {
        res.status(400).send({ status: "Error", error: "Failed to load products: " + error.message });
    }
});


router.get('/:pid', async(req,res)=>{
    try{
        let idProducto = parseInt(req.params.pid)
        const product = await manager.getProductById(idProducto)
        if(product !== null)
            res.send(product)
        else
            res.status(404).send({status:"Error", error: "Product not found"})
    }catch(error){
        res.status(400).send({status:"Error", error: `Failed to load product ${idProducto}`})
    }
})

router.post('/', uploader.array('files'), async(req,res)=>{
    try{
        if(!req.files){
            return res.status(400).send({status:"Error",error:"Failed to save the image"})
        }
        let product = req.body
        product.thumbnails = req.files.map(file => file.path)
        const addProduct = await manager.addProduct(product)
        if(addProduct !== null){
            res.status(200).send({status:"Ok",message:"Product added successfully"})
        }else{
            res.status(400).send({status:"Error", error: "Failed to add product"})
        }
    }catch(error){
        res.status(400).send({status:"Error", error: "Failed to add product"})
    }
})

router.put('/:pid', uploader.array('files'), async(req,res)=>{
    try{
        let idProducto = parseInt(req.params.pid)
        if(!req.files){
            return res.status(400).send({status:"Error",error:"Failed to update the image"})
        }
        let product = req.body
        product.thumbnails = req.files.map(file => file.path)
        const editProduct = await manager.updateProduct(idProducto,product)
        if(editProduct !== null){
            res.status(200).send({status:"Ok",message:"Product updated successfully"})
        }else{
            res.status(400).send({status:"Error", error: "Failed to update the product"})
        }
    }catch(error){
        res.status(400).send({status:"Error", error: "Failed to update the product"})
    }
})

router.delete('/:pid', async (req,res)=>{
    try{
        let idProducto = parseInt(req.params.pid)
        const product = await manager.deleteProduct(idProducto)
        if(product !== null)
            res.send({status:"OK", error: "Product deleted successfully"})
        else
            res.send({status:"Error", error: `Can't delete product with Id: ${idProducto}`})
    }catch(error){
        res.status(400).send({status:"Error", error: `Failed to delete product ${idProducto}`})
    }
})

export default router;