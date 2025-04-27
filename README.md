# jenosize_test_assignment

Assignment 01 และ 02 จะต่างกันตรงที่ตัวที่ 2 มีการปรับปรุงฟังก์ชั่น
เริ่ม โดยการ npm install
run code โดย การเข้าไปใน folder และรันคำสั่ง npm run dev
เส้น api (แนะนำให้ใช้ postman) จะมี
http://localhost:4040/api/v1/product 

ิตัวอย่าง body จะใช้
{
    "product_name": "productname",
    "stock_quantity": 1,
    "price": 100
}
เพื่อรับค่า

http://localhost:4040/api/v1/product?sorting=price&sorttype=ASC
ตัว sorting ใช้ column ในการ sort ได้ทั้งหมด และ sorttype ใช้ได้เป็น ASC และ desc

http://localhost:4040/api/v1/product/:product_id
เป็นตัวคำนวณ ราคา กับ จำนวน เพื่อหาราคารวม



Assignment 03 จะมีคำอธิบายไว้เรียบร้อยครับ