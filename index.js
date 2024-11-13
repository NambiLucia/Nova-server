const express =require('express')

const PORT = process.env.PORT || 3000


const app =express();

//middleware

app.get('/',(req,res)=>{
    return res.send("<h1>Welcome to NOVA Payment System Server</h1>")
})

app.listen(PORT,()=>{
    console.log(`Server listening on http://localhost:${PORT}`)
})