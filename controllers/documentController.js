const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()


exports.getDocuments = async (req,res)=>{

    try{
        let documents=await prisma.document.findMany({
            include:{
                payment
            }
        })
        res.json({
            documents,
            results:documents.length
        })

     


    }
    catch(error){
        return res.status(500).json({
           error: error.message
        })

    }

}
