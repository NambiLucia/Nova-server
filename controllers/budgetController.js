const {PrismaClient} = require('@prisma/client')
const { error } = require('console')
const prisma = new PrismaClient()


exports.getBudgetCodes = async (req,res)=>{

    try{
        let budgetCodes=await prisma.budget.findMany({
            include:{
                payment:true
            }
        })
        res.status(200).json({
            budgetCodes,
            results:budgetCodes.length
        })

    }
    catch(error){
        return res.status(500).json({
           error: error.message
        })

    }

}

exports.createBudgetCode =async(req,res)=>{
    try{
     
      const {name,code}=req.body;
      const existingCode =await prisma.budget.findUnique({
        where:{code}
      })

      const codePattern = /^ACC-\d+$/;
      if(!codePattern.test(code)){
        return res.status(400).json({
            error:"Budget code must follow the format 'ACC-<number>'"
        })
      }

  
       if (existingCode) {
          return res.status(409).json({ error: "This Budget code already exists" });
        }
    
  
      const newCode =await prisma.budget.create({
          data:{
            name,   
            code
          }
      });
  
  
  return res.status(201).json({
      message: "New Budget Code created successfully",
      BudgetCode: newCode,
  });
  
    }
    catch(error){
    return res.status(500).json({
             error: error.message
          })
    }
  }
  
  exports.updateBudgetCodeById = async (req, res) => {
    try {
      const updatedCode = await prisma.budget.update({
        where: {
          id: req.params.id,
        },
        data: req.body,
      });
      if (!updatedCode) {
        return res.status(404).json({ error: "Budget Code not found" });
      }
      return res.status(200).json({message:`Budget Code updated`,updatedCode});
    } catch (error) {
      return res
        .status(500)
        .json({ error: error.message });
    }
  };


  exports.deleteBudgetCodeById =async(req,res) =>{
    try{
        const deletedCode= await prisma.budget.delete({
            where:{
                id:req.params.id
            }
        }) 
        if(deletedCode){
            return res.status(200).json({message:'Budget Code deleted successfully', deletedCode});
        } else {
        return res.status(404).json({error:`Sorry Budget code doesnt exist `})}
    }
    catch(error){
        return res.status(404)
        .json({error:error.message})
    }

  }