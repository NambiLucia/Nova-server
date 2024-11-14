const express =require('express')

const userRoute =require('./routes/userroute');
const paymentRoute = require('./routes/paymentroute');





const PORT = process.env.PORT || 3000


const app =express();

//middleware
app.use(express.json())


//middleware for endpoints
app.use('/api/v1/users',userRoute)
app.use('/api/v1/payments',paymentRoute)


app.get('/',(req,res)=>{
    return res.send("<h1>Welcome to NOVA Payment System Server</h1>")
})

app.listen(PORT,()=>{
    console.log(`Server listening on http://localhost:${PORT}`)
})