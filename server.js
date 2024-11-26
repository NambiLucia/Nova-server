const express =require('express')
const fs = require("fs");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
var bodyParser = require('body-parser')

const userRoute =require('./routes/userroute');
const paymentRoute = require('./routes/paymentroute');
const documentRoute = require('./routes/documentroute');


const app =express();

//middleware
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, "logs", "request_logs.txt"),
    { flags: "a" }
  );
  
  // setup the logger
  app.use(morgan("combined", { stream: accessLogStream }));


// const upload =require('./upload');


//middleware for endpoints
app.use('/api/v1/users',userRoute)
app.use('/api/v1/payments',paymentRoute)
app.use('/api/v1/documents',documentRoute)


// app.post('/upload', upload.single('file'), (req, res) => {
//     // Handle the uploaded file
//     res.json({ message: 'File uploaded successfully!' });
//   });




app.get('/',(req,res)=>{
    return res.send("<h1>Welcome to NOVA Payment System Server</h1>")
})

module.exports=app;