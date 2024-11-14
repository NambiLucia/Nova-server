const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
require('dotenv/config');
const jwt = require("jsonwebtoken");
const { toISODateString } = require('../Utils/dateUtils');
const { date } = require('joi');




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

    const paymentDateISO = toISODateString(date);
    if(!paymentDateISO){
        return res.status(400).json({
            message:"Invalid payment date format"
        })

    }

    const newPayment =await prisma.payment.create({
        data:{
        date:paymentDateISO,
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
        }
    })

    return res.status(201).json({
        message: "Payment created successfully", newPayment 
    })

  }
  catch(error){
  return res.staus(500).json({
           error: error.message
        })
  }
}

