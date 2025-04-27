import asyncHandler from 'express-async-handler'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);

import { matchedData, validationResult } from 'express-validator'
import { checkProductDuplicateQuery, createProductQuery, getProductListQuery,getProductQuery } from '../utils/Queries/Product.js'
import { commitTransaction, exectTransacQuery, rollbackTransaction, runQuery, runTransacQuery, startTransaction } from '../db/sqlite.js'
import { searchAndFilter } from '../utils/helper/searchAndFilterData.js';



export const createProduct = asyncHandler(async(req,res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const data = matchedData(req)

    const {product_name,stock_quantity,price} = data

    const date_time_now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss') 

    const data_product = {
        product_name,
        stock_quantity,
        price,
        //? created_at_utc และ updated_at_utc ใช้ datetime ปัจจุบันเพื่อสามารถระบุวันที่สร้างได้
        created_at_utc: date_time_now,
        updated_at_utc: date_time_now,
    }
    const find_product_sql = checkProductDuplicateQuery()
    
    //? ทำ transaction เพื่อจะได้มี connection เดียว
    const connection = startTransaction()

    try {
        
        const product_found = await runTransacQuery(connection, find_product_sql, product_name)
        
        //? เข็ค product ที่ชื่อซ้ำกัน เพื่อป้องกันการสร้างซ้ำ
        if(product_found.length){
            throw new Error("Duplicate Product!")
        }

        const data_product_keys = Object.keys(data_product)
        const key_cols = data_product_keys.join(', ');
        const values_placeholder = data_product_keys.map(_ => '?').join(', ');
        const data_product_values = Object.values(data_product)
        
        const create_product_sql = await createProductQuery(key_cols,values_placeholder)
        
        await exectTransacQuery(connection, create_product_sql, data_product_values )
        
        commitTransaction(connection)
        return res.status(201).json({ success: true })

    } catch (error) {
        rollbackTransaction(connection)
        console.log("ERROR>>",error);
        
        return res.status(500).json({ success: false,message: error.message })
    }

})


export const getProductList = asyncHandler(async(req,res) =>{
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const data = matchedData(req)
    const { sorting,limit,search,filterdata,offset,sorttype } = data

    try {
        const {query: searchFilterQuery, params: searchFilterParams} = await searchAndFilter({sorting,sorttype,limit,search,filterdata,offset})
        
        let getProductListSql = await getProductListQuery()   

        getProductListSql += searchFilterQuery

        //? get product list โดยมีตัวจัดการเพื่อให้ได้ list ที่ต้องการ
        const getProductList = await runQuery(getProductListSql, searchFilterParams)
        return res.status(200).json({success: true, data: getProductList})
    
    } catch (error) {
        console.log("Error >> " ,error);
        return res.status(500).json({success: false,message: error.message})
    }
})

export const getCalculateTotalProductPrice = asyncHandler(async(req,res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const data = matchedData(req)
    const {product_id} = data
    try {
        
        let getProductSql = await getProductQuery()   
        
        //? get product by id
        const productList = await runQuery(getProductSql, product_id)
        
        //? loop หา price รวม โดยปรับให้อ่านง่ายและเร็วขึ้น จะเห็นความแตกต่างเมื่อข้อมูลเยอะขึ้น
        const total = productList.reduce((sum, { price, stock_quantity }) => {
            return sum + (parseFloat(price) * parseInt(stock_quantity))
        }, 0)
        return res.status(200).json({success: true, total: total})
    
    } catch (error) {
        console.log("Error >> " ,error);
        return res.status(500).json({success: false,message: error.message})
    }
})