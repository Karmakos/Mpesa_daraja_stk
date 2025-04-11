import express from 'express';
// import ngrok from 'ngrok';
import axios from 'axios';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import router from './controllers/lipaNaMpesa.js'
// import { initNgrok } from './middlewares/ngrokURL.js';
import {callback} from './controllers/lipaCallback.js';


dotenv.config();
const app = express();
const port = process.env.PORT || 8080;





const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());


app.use(router);
app.use(callback);


app.use('/static', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.get("/", async(req, res) => {
  res.render('payment', {failedMessage: null, successMessage: null});
  });

  app.get("/dashboard", async(req, res) => {
    res.render('dashboard');
    });

app.listen(port,  () => {

  console.log(`Server running on port ${port}`);

  });
  
