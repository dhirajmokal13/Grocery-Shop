# Grocery Shop (MERN) Ecommerce

A MERN app that allows multiple sellers to register and list their products for customers to purchase. 

## Features
- Seller registration and product listing 
- Customer payments using Razorpay online payment
- Map view of seller locations 
- Email notifications using SMTP protocol 
- Product reviews by customers 

## Technical stack
- MongoDB for data storage 
- Express for server-side routing 
- React for client-side rendering 
- Node.js for server-side logic 

## How to run
1. Clone the repository using `git clone https://github.com/dhirajmokal13/Grocery-Shop` if git installed otherwise download the code.
2. Run `npm install` in `/` and `/Client` Both Directories to install the required dependencies.
3. Create `.env` File and add Following data.
```bash
DATABASE_URL_ONLINE = ""
DATABASE_URL_OFFLINE = 'mongodb://localhost:27017'

CLIENT_URLS = ["http://127.0.0.1:3000", "http://localhost:3000"]
ALLOWED_METHODS = ["POST", "PUT", "GET", "PATCH", "DELETE"]

JWTKEY = 'authentication-key-example'
smtp_user = ''
smtp_pass = ''

razorpay_key_id = ''
razorpay_key_secret = ''
PORT = "8080"
```
4. Run `npm run dev` in `/` and `npm start` in `/Client` to start the development server 

## Preview
1. Home
![Home](https://drive.google.com/uc?export=view&id=1CnOlM_I7wHjkavdUUjL_ssrDFei7xSzf)

2. Signup
![Signup](https://drive.google.com/uc?export=view&id=1pDOPpJ35qHa3A6N15FWVtwGktmNByNv-)

3. Search
![Search](https://drive.google.com/uc?export=view&id=1HuumZ2etsXZE0hOkE-8N9uyncfbGfccV)

4. Sellers Location
![Sellers Location](https://drive.google.com/uc?export=view&id=17ME86hgrZVhJ5NfCaYNDsfkLhQYTGscB)

5. Order Page
![Order Page](https://drive.google.com/uc?export=view&id=1XJLFSFIFcxMiEKJqb9eH3g-yJbCkvHXA)

6. Payment
![Payment](https://drive.google.com/uc?export=view&id=1zc7ytIjWam1fhFlJkD95KtZPWUGzY8ST)

7. Customer Orders
![Customer Orders](https://drive.google.com/uc?export=view&id=1sHFh-JFWxwdmfHmT8cWKhgLcX14W7HII)

8. Manage Orders (Seller)
![Manage Orders](https://drive.google.com/uc?export=view&id=19DSy3U4xK_qH-lOHDV7_Cqo8kyGgbzDR)

9. Location Update (Seller)
![Location Update](https://drive.google.com/uc?export=view&id=14JZwAyEVmVbfXEPkfru3EzYp81hQ6J7i)