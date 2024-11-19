const express =require('express')

const cors = require("cors");
var bodyParser = require('body-parser')

const userRoute =require('./routes/userroute');
const paymentRoute = require('./routes/paymentroute');
const documentRoute = require('./routes/documentroute');






const PORT = process.env.PORT || 3000


const app =express();

//middleware
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const upload =require('./upload');


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

app.listen(PORT,()=>{
    console.log(`Server listening on http://localhost:${PORT}`)
})