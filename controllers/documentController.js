const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()


exports.getDocuments = async (req,res)=>{

    try{
        let documents=await prisma.document.findMany({
            include:{
                payment:true
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

exports.deleteDocumentById =async(req,res) =>{
    try{
        const deletedDocument= await prisma.document.delete({
            where:{
                id:req.params.id
            }
        }) 
        if(deletedDocument){
            return res.status(200).json({message:'Document deleted successfully', deletedDocument});
        } else {
        return res.status(404).json({error:`Sorry Document doesnt exist or is missing`})}
    }
    catch(error){
        return res.status(404)
        .json({error:error.message})
    }

  }