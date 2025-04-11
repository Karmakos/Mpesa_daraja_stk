# A Daraja STK Push API

A Node.js application that integrates with Safaricom's M-Pesa Daraja API to initiate STK Push (Lipa na M-Pesa) transactions.


## Project Features

- Initiate Lipa na M-Pesa Online (STK Push)
- Secured token generation using OAuth
- Configurable via `.env` file
- Uses Express.js for routing
- Redirects depending on User Input(Pays, Cancels, Expires, Fails due           insufficient balance)
- Compatible with Ngrok for callback testing

## Project Structure

Mpesa_daraja_stk/
├── controllers/
    ├── lipaCallback.js
    ├── lipaNaMpesa.js  
├── middleware/
    ├── authorization.js
    ├── ngrokURL.js 
├── public/
    ├── images/
    ├── js/
        ├── index.js
    ├── styles/
        ├── styles.css
├── views/ 
├── .env # Environment configuration file 
├── .gitignore # Ignored files for git 
├── package.json # Project metadata and dependencies 
├── server.js # Entry point of the application 
└── README.md # 


## Prerequisites

- [Node.js](https://nodejs.org/en/) v20 or higher
- npm (comes with Node.js)
- Safaricom Developer account
- Ngrok account (optional for local callback testing)

## 🛠 Installation

## 1. Clone the Repository

```bash
git clone https://github.com/Karmakos/Mpesa_daraja_stk.git
cd Mpesa_daraja_stk

## 2. Create an env file

- Create an env file and enter your details as follows:
- CONSUMER_KEY = 
- CONSUMER_SECRET = 
- DOMAIN = 
- BusinessShortCode = 
- MPESA_PASSKEY = 
- NGROK_AUTHTOKEN = 

## 3. Install Node Modules

run the node modules installtion command for NPM packages
    - npm i

## 4. Run the Project

run the project with the command
    - nodemon server.js or node server.js


















