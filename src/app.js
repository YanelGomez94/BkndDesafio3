import express from "express"
import ProductManager from './ProductManager.js'

const app = express()
const manager = new ProductManager('./productos.json')

app.use(express.urlencoded({extended:true}))

app.get('/products', async (req,res)=>{
    let {limit} = req.query
    try {
        const products = await manager.getProducts()
        if(limit){
            const limited = products.slice(0,limit)
            res.json(limited)
        }else{
            res.json(products)
        }
    } catch (error) {
        console.log(error)
    }
})

app.get('/products/:pid', async(req,res)=>{
    try{
        let idProducto = parseInt(req.params.pid)
        const product = await manager.getProductById(idProducto)
        if(product !== null)
            res.send(product)
        else
            res.send({Error:'Product not found'})
    }catch(error){
        console.log(error)
    }
})

app.listen(8080, ()=> console.log('Server ready'))