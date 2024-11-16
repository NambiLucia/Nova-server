const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
require('dotenv/config');
const jwt = require("jsonwebtoken");
const { toISODateString } = require('../Utils/dateUtils');
const { date } = require('joi');
const multer =require('multer');
const { error } = require('console');

const multerStorage =multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null,'upload-docs\docs')
    },
    filename:(req,file,cb) =>{
      const extension =file.mimetype.split('/')[1];
      cb(null,`payment-${req.payment.id}-${Date.now()}.${extension}`)
    }
});

const multerFilter = (req,file,cb)=>{
    if(file.mimetype.startsWith('pdf')){
        cb(null.true)
    }
    else{
        cb(error,false)
    }
}



const upload = multer({
    storage:multerStorage,
    fileFilter:multerFilter
})

exports.uploadDocs = upload.single('document')

exports.getPayments = async (req,res)=>{

    try{
        let payments =await prisma.payment.findMany({
            include:{
                user:{
                    select:{
                        fullname:true
                    }
                }
            }
        })
        res.json({
            payments,
           // requestedAt:new Date(Date.now()).toISODateString,
            results:payments.length
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
        status,
    }=req.body;

    // const paymentDateISO = toISODateString(date);
    // if(!paymentDateISO){
    //     return res.status(400).json({
    //         message:"Invalid payment date format"
    //     })

    // }

    const newPayment =await prisma.payment.create({
        data:{
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
        status,
        user:{
            connect:{
                id:userId
            }
        }
        }
    })

    return res.status(201).json({
        message: "Payment created successfully", newPayment 
    })

  }
  catch(error){
  return res.status(500).json({
           error: error.message
        })
  }
}

