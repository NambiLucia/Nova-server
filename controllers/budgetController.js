const {PrismaClient} = require('@prisma/client')
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
  
