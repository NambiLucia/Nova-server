const {PrismaClient} = require('@prisma/client')
const { error } = require('console')
const prisma = new PrismaClient()


exports.getBeneficiaryCodes = async (req,res)=>{

    try{
        let beneficiaryCodes=await prisma.beneficiary.findMany({
            include:{
                payment:true
            }
        })
        res.status(200).json({
            beneficiaryCodes,
            results:beneficiaryCodes.length
        })

    }
    catch(error){
        return res.status(500).json({
           error: error.message
        })

    }

}

exports.createBeneficiaryCode =async(req,res)=>{
    try{
     
      const {name,code}=req.body;
      const existingCode =await prisma.beneficiary.findUnique({
        where:{code}
      })

      const codePattern = /^BEN-\d+$/;
      if(!codePattern.test(code)){
        return res.status(400).json({
            error:"Beneficiary codes must follow the format 'BEN-<number>'"
        })
      }

  
       if (existingCode) {
          return res.status(409).json({ error: "This Budget code already exists" });
        }
    
  
      const newCode =await prisma.beneficiary.create({
          data:{
            name,   
            code
          }
      });
  
  
  return res.status(201).json({
      message: "New Budget Code created successfully",
      BeneficiaryCode: newCode,
  });
  
    }
    catch(error){
    return res.status(500).json({
             error: error.message
          })
    }
  }
  
  exports.updateBeneficiaryCodeById = async (req, res) => {
    try {
      const updatedCode = await prisma.beneficiary.update({
        where: {
          id: req.params.id,
        },
        data: req.body,
      });
      if (!updatedCode) {
        return res.status(404).json({ error: "Beneficiary Code not found" });
      }
      return res.status(200).json({message:`Beneficiary Code updated`,updatedCode});
    } catch (error) {
      return res
        .status(500)
        .json({ error: error.message });
    }
  };


  exports.deleteBeneficiaryCodeById =async(req,res) =>{
    try{
        const deletedCode= await prisma.beneficiary.delete({
            where:{
                id:req.params.id
            }
        }) 
        if(deletedCode){
            return res.status(200).json({message:'Beneficiary Code deleted successfully', deletedCode});
        } else {
        return res.status(404).json({error:`Sorry Beneficiary Code doesnt exist `})}
    }
    catch(error){
        return res.status(404)
        .json({error:error.message})
    }

  }