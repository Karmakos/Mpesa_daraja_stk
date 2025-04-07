import express from 'express';
import ngrok from 'ngrok';
import axios from 'axios';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { authToken } from './middlewares/authorization.js';
import router from './controllers/lipaNaMpesa.js'
import { initNgrok } from './middlewares/ngrokURL.js';
import callback from './controllers/lipaCallback.js';


dotenv.config();
const app = express();
const port = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(initNgrok)
app.use(authToken)


app.use(router);
app.use(callback);

app.use('/static', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get("/", async(req, res) => {
  console.log(req.callbackUrl)
    res.render('payment');
  });


app.get("/success", (req, res) => {
res.render('success');
});

app.get("/processing", (req, res) => {
    res.render('processing');
    });
app.get("/failed", (req, res) => {
    res.render('failed');
    });

app.listen(port, async () => {

  console.log(`Server running on port ${port}`);

  });
  
