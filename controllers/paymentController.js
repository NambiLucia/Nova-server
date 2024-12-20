const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
require('dotenv/config');
const jwt = require("jsonwebtoken");
const { toISODateString } = require('../Utils/dateUtils');
const { date } = require('joi');
const multer =require('multer');
const path =require('path');
const { error } = require('console');

const multerStorage =multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null,path.join(__dirname,'../upload-docs/docs'))
    },
    filename:(req,file,cb) =>{
      const extension =file.mimetype.split('/')[1];
      cb(null,`payment-${Date.now()}.${extension}`)
    }
});

const multerFilter = (req,file,cb)=>{
    if(file.mimetype === 'application/pdf'){
        cb(null,true)
    }
    else{
        cb(new Error('Only PDF files are allowed'), false); // Reject non-PDF files
    }
}


// initialize Multer
const upload = multer({
    storage:multerStorage,
    fileFilter:multerFilter,
    limits:{
        fileSize:5 * 1024 * 1024, // Limit files to 5MB
    }
})

exports.uploadDocs = upload.single('document',10)

exports.getPayments = async (req,res)=>{

    try{
        const limit = parseInt(req.query.limit) || 10
        let payments =await prisma.payment.findMany({
            take:limit,
            orderBy:{
                createdAt:'desc'
            },

            include:{
                user:{
                    select:{
                        fullname:true
                    }
                },
                Document:true
            }
        })
        res.status(200).json({
            results:payments.length,
            payments:payments,
            requestedAt: new Date().toISOString(),
            
        })

     


    }
    catch(error){
        return res.status(500).json({
           error: error.message
        })

    }

}


exports.getPaymentsById=async(req,res)=>{
    try{
        userId=req.params.id;
        const payments= await prisma.payment.findMany({
            where:{
            userId:userId
            },
            orderBy:{
                createdAt:'desc'
            },
           
        })

        res.status(200)
            .json({
            results:payments.length,
            payments:payments,
            requestedAt: new Date().toISOString(),
            
        })

    }
    catch(error){
        return res.status(500).json({
           error: error.message
        })

    }
}






exports.createPayment =async(req,res)=>{
  try{
    const userId =req.user.id;
    const {
        date,
        voucherNo,
        payee,         
        paymentDetails, 
        accountCode,
        beneficiaryCode,
        budgetCode, 
        exchangeRate, 
        amountFigures, 
        amountWords, 
        status
    
    }=req.body;

    // const paymentDateISO = toISODateString(date);
    // if(!paymentDateISO){
    //     return res.status(400).json({
    //         message:"Invalid payment date format"
    //     })

    // }

    // if (!date || !voucherNo || !payee || !paymentDetails || !accountCode || !beneficiaryCode || !budgetCode || !exchangeRate || !amountFigures|| !amountWords || !status || !document) {
    //     return res.status(400).json({ error: "All fields are required."});
    //   }

    if (!req.file) {
        return res.status(400).json({ error: "PDF file is required" });
      }
  



    const newPayment =await prisma.payment.create({
        data:{
        date,
        voucherNo: parseInt(voucherNo),
        payee,         
        paymentDetails, 
        accountCode: {
            connect: {
                code: accountCode,
            },
        },
        beneficiaryCode :{
            connect:{
                code:beneficiaryCode
            }
        },
        budgetCode:{
            connect:{
                code:budgetCode
            }
        },  
        exchangeRate: parseFloat(exchangeRate), 
        amountFigures: parseFloat(amountFigures), 
        amountWords, 
        status,
        user:{
            connect:{
                id:userId
            }
        },
        //document
        }
    });

//if a file is uploaded
try {
    const { filename, mimetype, path: filepath } = req.file;
    await prisma.document.create({
        data: {
            filename,
            filetype: mimetype,
            filepath,
            payment: 
            { connect: 
                { id: newPayment.id } 
            },
        },
    });
} catch (err) {
    return res.status(500).json({ error: "File upload failed. Please try again." });
}

return res.status(201).json({
    message: "Payment created successfully",
    payment: newPayment,
    document: { filename: req.file.filename, path: req.file.path },
});

  }
  catch(error){
  return res.status(500).json({
           error: error.message
        })
  }
}



exports.updatePaymentById = async (req, res) => {
    try {
      const updatedPayment = await prisma.payment.update({
        where: {
          id: req.params.id,
        },
        data: req.body,
      });
      if (!updatedPayment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      return res.status(200).json({message:`Payment updated`,updatedPayment});
    } catch (error) {
      return res
        .status(500)
        .json({ error: error.message });
    }
  };

  exports.deletePaymentById =async(req,res) =>{
    try{
        const deletedPayment= await prisma.payment.delete({
            where:{
                id:req.params.id
            }
        }) 
        if(deletedPayment){
            return res.status(200).json({message:'Payment deleted', deletedPayment});
        } else {
        return res.status(404).json({error:`Sorry payment doesnt exist `})}
    }
    catch(error){
        return res.status(404)
        .json({error:"Sorry,Payment doesnt exist"})
    }

  }