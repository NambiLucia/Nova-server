const {PrismaClient} = require('@prisma/client')
const { error } = require('console')
const prisma = new PrismaClient()


exports.getAccountCodes = async (req,res)=>{

    try{
        let accountCodes=await prisma.account.findMany({
            include:{
                payment:true
            }
        })
        res.status(200).json({
            accountCodes,
            results:accountCodes.length
        })

    }
    catch(error){
        return res.status(500).json({
           error: error.message
        })

    }

}

exports.createAccountCode =async(req,res)=>{
    try{
     
      const {name,code}=req.body;
      const existingCode =await prisma.account.findUnique({
        where:{code}
      })

      const codePattern = /^ACC-\d+$/;
      if(!codePattern.test(code)){
        return res.status(400).json({
            error:"Account codes must follow the format 'ACC-<number>'"
        })
      }

  
       if (existingCode) {
          return res.status(409).json({ error: "This Account code already exists" });
        }
    
  
      const newCode =await prisma.account.create({
          data:{
            name,   
            code
          }
      });
  
  
  return res.status(201).json({
      message: "New Account Code created successfully",
      AccountCode: newCode,
  });
  
    }
    catch(error){
    return res.status(500).json({
             error: error.message
          })
    }
  }
  
  exports.updateAccountCodeById = async (req, res) => {
    try {
      const updatedCode = await prisma.account.update({
        where: {
          id: req.params.id,
        },
        data: req.body,
      });
      if (!updatedCode) {
        return res.status(404).json({ error: "Account Code not found" });
      }
      return res.status(200).json({message:`Account Code updated`,updatedCode});
    } catch (error) {
      return res
        .status(500)
        .json({ error: error.message });
    }
  };


  exports.deleteAccountCodeById =async(req,res) =>{
    try{
        const deletedCode= await prisma.account.delete({
            where:{
                id:req.params.id
            }
        }) 
        if(deletedCode){
            return res.status(200).json({message:'Account Code deleted successfully', deletedCode});
        } else {
        return res.status(404).json({error:`Sorry Account Code doesnt exist or is missing `})}
    }
    catch(error){
        return res.status(404)
        .json({error:error.message})
    }

  }