import express from "express";
import productsRouter from "../routes/productsRoutes.js";
import cartsRouter from "../routes/cartsRoutes.js";

const app = express()
const port = 8080

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/products/',productsRouter)
app.use('/api/carts/', cartsRouter)

const server = app.listen(port, () => console.log(`Server up and running on port ${port}`));
