import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
import { createProductTable } from './db/createTable.js';
import productRouter from './routes/productRoutes.js';
dotenv.config();

const app = express()
const PORT = process.env.PORT || 4040;

app.use(express.json())
app.use(cors())

createProductTable()

app.use("/api/v1/product",productRouter)

//Server
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})