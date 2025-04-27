

export const checkProductDuplicateQuery = () =>{
    //? check product ชื่อซ้ำ where ตัวที่ยังไม่ถูกลบ
    const sql = ` SELECT * FROM products WHERE product_name = ? AND deleted_at_utc IS NULL; `
    return sql
}

export const createProductQuery = (product_columns,values_placeholder) =>{
    const sql = ` INSERT INTO products ( ${product_columns} ) VALUES ( ${values_placeholder} ) ; `
    return sql
}

export const getProductListQuery = () =>{
    //? query get list โดย where ตัวที่ยังไม่ถูกลบ
    const sql = ` 
    SELECT 
        id,
        product_name,
        stock_quantity,
        price,
        created_at_utc,
        updated_at_utc,
        deleted_at_utc
    FROM products 
    WHERE deleted_at_utc IS NULL
    `
    return sql
}

export const getProductQuery = () =>{
    //? query get list โดย where ตัวที่ยังไม่ถูกลบ
    const sql = ` 
    SELECT 
        id,
        product_name,
        stock_quantity,
        price,
        created_at_utc,
        updated_at_utc,
        deleted_at_utc
    FROM products 
    WHERE deleted_at_utc IS NULL AND id = ?
    `
    return sql
}