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
        document
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
        voucherNo: parseInt(voucherNo),
        payee,         
        paymentDetails, 
        accountCode, 
        beneficiaryCode,
        budgetCode, 
        exchangeRate: parseFloat(exchangeRate), 
        amountFigures: parseFloat(amountFigures), 
        amountWords, 
        status,
        user:{
            connect:{
                id:userId
            }
        },
        document
        }
    });

//if a file is uploaded
if(req.file){
    const { filename, mimetype, path: filepath } = req.file;

    await prisma.document.create({
        data:{
            filename,
            filetype:mimetype,
            filepath,
            payment:{
                connect:{
                    id:newPayment.id
                }
            }
        }
    })




}




    return res.status(201).json({
        message: "Payment created successfully", newPayment,document
    })

  }
  catch(error){
  return res.status(500).json({
           error: error.message
        })
  }
}

