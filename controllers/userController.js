const {PrismaClient, Role} = require('@prisma/client')
const prisma = new PrismaClient()
var jwt = require('jsonwebtoken');
require('dotenv/config');
const bcrypt = require('bcrypt');
const nodemailer =require("nodemailer")



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
                {id:user.id,email:user.email,role:user.role,name:user.fullname},
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


  exports.forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Validate email input
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
  
      // Find the user by email
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
  
      // If user doesn't exist, return an error
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Generate a JWT token for password reset
      const resetToken = jwt.sign(
        { id:user.id,email: user.email},
        process.env.SECRET_KEY,
        { expiresIn: "15m" } // Token expires in 15 minutes
      );
  
      // Create reset password link
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      console.log("Reset Link:", resetLink); 
  
      // Configure nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false, // Ignores self-signed certificate errors
        },
      });
  
      // Define email options
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email, // Send to the user's email
        subject: "NOVA Payment Password Reset Request",
        text: `Click the link below to reset your password (valid for 15 minutes):\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`,
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
      console.log("Reset email sent to:", email); // For debugging purposes
  
      // Respond with success message
      return res.status(200).json({ message: "Password reset link sent succcesfully to your email" });
    } catch (error) {
      console.error("Error in forgotPassword:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
exports.resetPassword = async (req, res) => {
    try {
   
        const { resetToken,newPassword } = req.body;  
        if (!resetToken) {
            return res.status(400).json({ message: "Token is required" });
        }

        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(resetToken, process.env.SECRET_KEY); 
        } catch (error) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Find the user using the decoded user ID
        const user = await prisma.user.findUnique({
            where: { id: decoded.id }, 
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Invalid or expired token" });
    }
};
 
