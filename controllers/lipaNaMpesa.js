import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import { getTimeStamp } from '../utils/timestamp.utils.js';


dotenv.config();
const router = express.Router();




router.post("/lipaNaMpesa", async (req, res) => {
  try {

        const number = req.body.phoneNumber.replace(/^0/, ''); // remove leading 0 if any
        const phoneNumber = `254${number}`;
        const timestamp = getTimeStamp();

        // Get access_token properly (req.authData must be set by middleware)
        const access_token = req.authData;
        if (!access_token) {
          return res.status(401).json({ error: "Access token missing" });
        }

        // Callback URL
        const domain = req.callbackUrl;
        console.log(domain);


        const password = Buffer.from(`${process.env.BusinessShortCode}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');

        const url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

        const body = {
          "BusinessShortCode": process.env.BusinessShortCode,
          "Password": password,
          "Timestamp": timestamp,
          "TransactionType": "CustomerPayBillOnline",
          "Amount": "1",
          "PartyA": phoneNumber,
          "PartyB": process.env.BusinessShortCode,
          "PhoneNumber": phoneNumber,
          "CallBackURL": `${domain}/callbackURL`,
          "AccountReference": "CMT1234RT",
          "TransactionDesc": "Unlimited Internet"
        };

        return await axios.post(url, body, {
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
          }
        });



  } catch (error) {
    console.error("STK Push Error:", error.response?.data || error.message);
    const errorData = error.response?.data;
    const errorMessage = errorData.errorMessage;
    res.render('payment', { message: {
                              type: "failed", 
                              heading: "Error sending the push request",
                              desc: errorMessage
                          }
    })
  }
});



export default router;
