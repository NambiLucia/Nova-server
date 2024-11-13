const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
require('dotenv/config');
const bcrypt = require('bcrypt');



exports.getUsers = async (req,res)=>{

    try{
        let users =await prisma.user.findMany()
        res.json(users)
    }
    catch(error){
        return res.json({
           error: error.message
        })

    }

}

exports.register = async(req,res)=>{
    try{
        const {fullname,email,password}=req.body; 
        const hashedPassword = await bcrypt.hash(password,10)
    
        const newUser = await prisma.user.create({
            data:{
                fullname,
                email,
                password
            }
        })
        return res
        .status(200)
        .json({'message':"New User registered Successfully",newUser})

    }
    catch(error){
        console.log(error)
        return res.status(500)
        .json({"message":"Error occured while registering new User"})

    }
}

