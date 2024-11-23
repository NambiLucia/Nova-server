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

exports.getSomePayments =async(req,res) =>{
    try{
        const somePayments = await prisma.payment.findMany({
            take:1
        })
        res.json(somePayments)
    }
    catch(error){
        return res.status(500).json({
            error:error.message
        })
    }
}

exports.sortpaymentsByDate =async(req,res) =>{
    try{
        const sortPayments = await prisma.payment.findMany({
            orderBy:{
                createdAt:'desc'
            }
        })

        return res.json(sortPayments)


    }

    catch(error){
        return res.status(500).json({error:error.message})
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

    // if (!date || !voucherNo || !payee || !paymentDetails || !accountCode || !beneficiaryCode || !budgetCode || !exchangeRate || !amountFigures|| !amountWords || !status || !document) {
    //     return res.status(400).json({ error: "All fields are required."});
    //   }

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
            return res.status(200).json({error:'Payment deleted', deletedPayment});
        } else {
        return res.status(404).json({message:`Sorry payment doesnt exist `})}
    }
    catch(error){
        return res.status(404)
        .json({error:"Sorry,Payment doesnt exist"})
    }

  }