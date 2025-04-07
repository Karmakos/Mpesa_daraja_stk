import express from 'express';
// import ngrok from 'ngrok';
import axios from 'axios';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from 'socket.io';
import { authToken } from './middlewares/authorization.js';
import router from './controllers/lipaNaMpesa.js'
import { initNgrok } from './middlewares/ngrokURL.js';
import {callback} from './controllers/lipaCallback.js';
import session from 'express-session';


dotenv.config();
const app = express();
const port = process.env.PORT;
const server = http.createServer(app);
const io = new Server(server);




const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.use(initNgrok)
app.use(authToken)


app.use(router);
app.use(callback(io));


app.use('/static', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

io.on('connection', (socket) =>{
  console.log('A user connected:', socket.id);


  socket.on('disconnect', () =>{
    console.log('A user disconnected:', socket.id);
  })

})



app.get("/", async(req, res) => {
  console.log(req.callbackUrl);  
  res.render('payment', {message: null});
  });

  app.get("/dashboard", async(req, res) => {
    res.render('dashboard');
    });

server.listen(port,  () => {

  console.log(`Server running on port ${port}`);

  });
  