const express =require('express')
const fs = require("fs");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
var bodyParser = require('body-parser')

const userRoute =require('./routes/userroute');
const paymentRoute = require('./routes/paymentroute');
const documentRoute = require('./routes/documentroute');
const budgetRoute = require('./routes/budgetroute');
const beneficiaryRoute = require('./routes/beneficiaryroute');
const accountRoute = require('./routes/accountroute');


const app =express();

//middleware
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// // Serve static files from the Vite build folder
// app.use(express.static(path.join(__dirname, "dist")));

// // Handle all routes by serving index.html
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "dist", "index.html"));
// });

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, "logs", "request_logs.txt"),
    { flags: "a" }
  );
  
  // setup the logger
  app.use(morgan("combined", { stream: accessLogStream }));





//middleware for endpoints
app.use('/api/v1/users',userRoute)
app.use('/api/v1/payments',paymentRoute)
app.use('/api/v1/documents',documentRoute)
app.use('/api/v1/budgetcodes',budgetRoute)
app.use('/api/v1/beneficiarycodes',beneficiaryRoute)
app.use('/api/v1/accountcodes',accountRoute)

// app.all('*',(req,res,next) =>{
//   return res.status(404).json({
//     status:"Fail",
//     message:`Cant find ${req.originalUrl} on this Server`
//   })
// })
// //error handling middleware
// app.use((err,req,res,next)=>{
//   err.statusCode =err.statusCode || 500;
//   err.status = err.status || 'error'
//   return res.status(err.statusCode).json({
//     status:err.status,
//     message:err.message
//   })
// })








// app.get("/reset-password", (req, res) => {
//   res.send("Reset password page");
// });


app.get('/',(req,res)=>{
    return res.send("<h1>Welcome to NOVA Payment System Server</h1>")
})

module.exports=app;