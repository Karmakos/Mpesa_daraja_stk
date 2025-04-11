import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import { getTimeStamp } from '../utils/timestamp.utils.js';
import {authToken} from '../middlewares/authorization.js'

dotenv.config();
const router = express.Router();


router.post("/lipaNaMpesa", authToken, async (req, res) => {
  try {

//------STK PUSH SENDING REQUEST-    

        const number = req.body.phoneNumber.replace(/^0/, ''); // remove leading 0 if any
        const phoneNumber = `254${number}`;
        const timestamp = getTimeStamp();

        // Get access_token properly (req.authData must be set by middleware)
        const access_token = req.authData;
        if (!access_token) {
          return res.status(401).json({ error: "Access token missing" });
        }

        // Callback URL
        const domain = process.env.DOMAIN || req.callbackUrl;
        console.log(domain);


        const password = Buffer.from(`${process.env.BusinessShortCode}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');

        const stkUrl = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

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

        // STK PUSH

        const response = await axios.post(stkUrl, body, {
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
          }
        });

        const stkResponse = response.data;

        console.log(stkResponse);

       

 //------ Checking Status of a transaction
 
          const queryEndpoint = 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query';

          let resultCode, resultDesc;

          if (stkResponse.ResponseCode == '0') {

            const requestID = stkResponse.CheckoutRequestID;

            const queryPayload = {
              "BusinessShortCode": process.env.BusinessShortCode,
              "Password": password,
              "Timestamp": timestamp,
              "CheckoutRequestID": requestID
            };

            const timer = setInterval(async () => {
              try {
                const status = await axios.post(queryEndpoint, queryPayload, {
                  headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                  }
                });

                resultCode = status.data.ResultCode;
                resultDesc = status.data.ResultDesc;

                console.log('Query response:', resultCode, resultDesc);

                // Stop the interval if you get a final result (e.g., success or failure)
                if (resultCode == '0') {
                  res.render('success',  {type: "Successful", 
                                    heading: "Payment Request Successful",
                                    desc: "The payment request was processed successfully."
                    });      
                    clearInterval(timer);

                } else if(resultCode === '1032') {
                  res.render('failed', {type: "cancelled", 
                                        heading: "Request cancelled by the User",
                                        desc: "The user cancelled the request on their phone. Please try again and enter your pin to confirm payment"
                                        });
                  clearInterval(timer);

                        
              } else if(resultCode === '1') {
                res.render('failed', {type: "failed", 
                                      heading: "Request failed due to insufficient balance",
                                      desc: "Please deposit funds on your M-PESA or use Overdraft(Fuliza) to complete the transaction"
                                      });     
                clearInterval(timer);
            
              } else {
                res.render('failed', {type: "failed", 
                                      heading: "Payment request failed",
                                      desc: `${resultDesc}. Please try again to complete the transaction`,
                                      });
                  clearInterval(timer);

                  }

              } catch (error) {
                console.error('Error in STK Push query:', error.response ? error.response.data : error.message);
                


              }
            }, 2000); 

          }


      } catch (error) {
        console.error("STK Push Error:", error.response?.data || error.message);
        const errorData = error.response?.data;
        // console.log(errorData)
        const errorMessage = errorData.errorMessage;

        console.log(errorMessage);
        res.render('failed', {  type: "failed", 
                                heading: "Error sending the push request",
                                desc: errorMessage}
        )
      }
});



export default router;
