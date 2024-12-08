const {PrismaClient, Role} = require('@prisma/client')
const prisma = new PrismaClient()
var jwt = require('jsonwebtoken');
require('dotenv/config');
const bcrypt = require('bcrypt');



exports.getUsers = async (req,res)=>{

    try{
        const limit =parseInt(req.query.limit) || 10;
        let users =await prisma.user.findMany({
            take:limit
        })
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
        const {fullname,email,password,role}=req.body; 
        const existingUser= await prisma.user.findUnique({
            where:{email}
        })

        if(existingUser){
            return res.status(400).json({message:"email already in use"})
        }
        const hashedPassword = await bcrypt.hash(password,10)
    
        const newUser = await prisma.user.create({
            data:{
                fullname,
                email,
                password:hashedPassword,
                role
            }
        })
        return res
        .status(200)
        .json({'message':"New User registered Successfully",newUser})

    }
    catch(error){
        console.log(error)
        return res.status(500)
        .json({error:"Error occured while registering new User"})

    }
}

//login

exports.login =async(req,res)=>{
    try{
        const {email,password}=req.body;
        let user=await prisma.user.findUnique({
            where:{
                email
            }
        });
        if(user){
            const matchPassword = await bcrypt.compare(password,user.password)
            if(matchPassword){
                //create token
                const userToken =await jwt.sign(
                {id:user.id,email:user.email,role:user.role},
                process.env.SECRET_KEY,{expiresIn:'1hr'}


            )
            //send token back as response
            const date = new Date()
            res.status(200).json({
                message:"Successful User Login",userToken
            })
            console.log(userToken,`Token Generated at:- ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)

        }
                
            else{
                return res.status(401).json({
                    'error':'Wrong Password'
                })

            }


        }
        else{
            return res.status(500).json({
                "error":"User not found",user
            })
        }





    }
    catch(error){
        console.log(error)
        return res.status(500)
        .json({error:error.message})
    }
}

exports.updateUserById = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: "User ID is required" });
          }

      const updatedUser = await prisma.user.update({
        where: {
          id: req.params.id,
        },
        data: req.body,
      });
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found"});
      }
      return res.status(200).json({message:`User updated`,updatedUser});
    } catch (error) {
      return res
        .status(500)
        .json({ error: error.message });
    }
  };

  exports.deleteUserById =async(req,res) =>{
    try{
        const deletedUser= await prisma.user.delete({
            where:{
                id:req.params.id
            }
        }) 
        if(deletedUser){
            return res.status(200).json({message:'User deleted', deletedUser});
        } else {
        return res.status(404).json({error:`Sorry user does not exist`})}
    }
    catch(error){
        return res.status(404)
        .json({error:error.message})
    }

  }


