const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
  optionsSuccessStatus: 200 
}));

const port = 3000;

const router = require('./3s_class/v1');
app.use('/3s_class/v1/', router);

app.listen(port);
console.log(`[Info] listening on port ${port}.`);