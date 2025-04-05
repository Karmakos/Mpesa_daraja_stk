import express from 'express';

const app = express()

app.use(express.json());

const callback = express.Router();

callback.post('/callback', (req, res) => {
    const result = req.body;
    console.log(`Safaricom Callback Received:`);
    console.log(JSON.stringify(result, null, 2));

    // Always respond with a 200 status
    res.status(200).json({ message: "Callback received successfully" });
});


export default callback;
 