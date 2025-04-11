import express from 'express';


const app = express()

app.use(express.json());



const callback = express.Router();


callback.post('/callbackURL', (req, res) => {
        
        const result = req.body;
        console.log(`Safaricom Callback Received:`);
        console.log(JSON.stringify(result, null, 2));

        
       res.status(200).json({
            message: 'Callback Received Successfully',
            success: true
            });

    });





export {callback};
 