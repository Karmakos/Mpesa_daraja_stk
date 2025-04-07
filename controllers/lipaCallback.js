import express from 'express';
import { Server } from 'socket.io';


const app = express()

app.use(express.json());

const callback = (io) =>{

        const router = express.Router();


        router.post('/callbackURL', (req, res) => {
                
                const result = req.body;
                console.log(`Safaricom Callback Received:`);
                console.log(JSON.stringify(result, null, 2));

                const resultCode = result.Body.stkCallback.ResultCode;
                const resultDesc = result.Body.stkCallback.ResultDesc;

                let message;

                if(resultCode === 0){
                    message = {
                        code: 1,
                        type: "Successful", 
                        heading: "Request Successful",
                        desc: "The payment was successful"
                        }
                } else if (resultCode === 1032) {
                    message = {
                        code: 0,
                        type: "cancelled", 
                        heading: "Request cancelled by the User",
                        desc: "The user canceled the request on their phone. Please try again and enter your pin to confirm payment"
                        }
                        
                } else if(resultCode === 1) {
                    message = {
                        code: 0,
                        type: "failed", 
                        heading: "Request failed due to insufficient balance",
                        desc: "Please deposit funds on your M-PESA or use Overdraft(Fuliza) to complete the transaction"
                        }        
                } else{
                    message = {
                        code: 0,
                        type: "failed", 
                        heading: "Payment request failed",
                        desc: `${resultDesc} Please try again to complete the transaction`,
                        } 
                    }



                io.emit('paymentStatus', message );



                res.status(200);

            });

            return router;
} 



 



export {callback};
 