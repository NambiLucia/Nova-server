const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
require('dotenv/config');
const jwt = require("jsonwebtoken");
const { toISODateString } = require('../Utils/dateUtils');
const { date } = require('joi');
const multer =require('multer');
const path =require('path');
const { error } = require('console');
const { pipeline } = require('stream');
const { idText } = require('typescript');

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
        cb(new Error('Only PDF files are allowed'), false); 
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
                Document:true,
                accountCode:{
                    select:{
                        code:true
                    }
                },
                beneficiaryCode:{
                    select:{
                        code:true
                    }
                },
                budgetCode:{
                    select:{
                        code:true
                    }
                },
      
      
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

//Get payments by userID

exports.getPaymentsByUserId=async(req,res)=>{
    try{
        //const userid=req.params.id;
        const payments= await prisma.payment.findMany({
            where:{
            userId:req.params.id
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



// exports.getPaymentsByUserId = async (req, res) => {
//     try {
//       const userId = req.params.id;
  
//       // Group payments by status and count the occurrences for each status
//       const paymentStatusCount = await prisma.payment.groupBy({
//         by: ['status'], // Group by the 'status' column
//         where: {
//           userId: userId, // Filter by the logged-in user's ID
//         },
//         _count: {
//           status: true, // Count the number of rows for each status
//         },
//       });
  
//       // Format the data to return a count for each status
//       const formattedData = paymentStatusCount.map((item) => ({
//         status: item.status,
//         count: item._count.status,
//       }));
  
//       // Ensure all statuses are included, even if the count is zero
//       const allStatuses = ['INITIATED', 'APPROVED', 'REJECTED']; // Add more statuses if needed
//       const completeData = allStatuses.map((status) => {
//         const found = formattedData.find((item) => item.status === status);
//         return {
//           status,
//           count: found ? found.count : 0,
//         };
//       });
  
//       // Return the response with the formatted data
//       res.status(200).json({
//         results: completeData.length,
//         paymentStatus: completeData,
//         requestedAt: new Date().toISOString(),
//       });
//     } catch (error) {
//       console.error('Error fetching payment status:', error);
//       return res.status(500).json({
//         error: error.message,
//       });
//     }
//   };

  


  





  
  

//Get payments by Payment ID
exports.getPaymentsByPaymentId=async(req,res)=>{
    try{
      
        const payments= await prisma.payment.findUnique({
            where:{
           id:req.params.id
            },
            include: {
                accountCode:{
                    select:{
                        code:true
                    }
                },
                beneficiaryCode:{
                    select:{
                        code:true
                    }
                },
                budgetCode:{
                    select:{
                        code:true
                    }
                },

                Document:{
                    select:{
                        filename:true
                    }
                }
              },

        })

        res.status(200)
            .json({
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

// exports.getPaymentStatus = async (req, res) => {
//     try {
//       // Use Prisma's groupBy to group payments by status and count them
//       const paymentStatus = await prisma.payment.groupBy({
//         by: ['status'], // Group by the 'status' column
//         _count: {
//           status: true, // Count the number of rows for each status
//         },
//       });
  
//       // Format the data for the response
//       const formattedData = paymentStatus.map((item) => ({
//         status: item.status,
//         count: item._count.status,
//       }));
  
//       res.status(200).json(formattedData);
//     } catch (error) {
//       console.error('Error fetching payment status:', error);
//       res.status(500).json({ message: 'Error fetching payment status' });
//     }
//   };

exports.getPaymentStatus = async (req, res) => {
    try {
      const userId = req.user.id; // Assuming `req.user` contains the authenticated user's details
  
      // Validate userId
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated." });
      }
  
      // Use Prisma's groupBy to group payments by status and filter by userId
      const paymentStatus = await prisma.payment.groupBy({
        by: ['status'], // Group by the 'status' column
        where: {
          userId: userId, // Filter by the logged-in user's ID
        },
        _count: {
          status: true, // Count the number of rows for each status
        },
      });
  
      // Format the data for the response
      const formattedData = paymentStatus.map((item) => ({
        status: item.status,
        count: item._count.status,
      }));
  
      // Ensure all statuses are included, even if the count is zero
      const allStatuses = ['INITIATED', 'APPROVED', 'REJECTED']; // Add more statuses if necessary
      const completeData = allStatuses.map((status) => {
        const found = formattedData.find((item) => item.status === status);
        return {
          status,
          count: found ? found.count : 0,
        };
      });
  
      res.status(200).json(completeData);
    } catch (error) {
      console.error('Error fetching payment status:', error);
      res.status(500).json({ message: 'Error fetching payment status' });
    }
  };
  






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



exports.approvePayment = async (req, res) => {
    const { id } = req.params; // The payment ID
    const user = req.user; // Assuming the authenticated user is attached to the request
  
    // Check if the user has the 'ADMIN' role
    if (user.role !== 'ADMIN') {
      return res.status(403).json({ message: "Access denied: Only admins can approve payments" });
    }
  
    try {
      // Find the payment by ID
      const payment = await prisma.payment.findUnique({
        where: { id: id },
      });
  
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
  
      // Check if the payment is already approved
      if (payment.status === "APPROVED") {
        return res.status(400).json({ message: "Payment is already approved" });
      }
  
      // Update the payment status to "APPROVED"
      const updatedPayment = await prisma.payment.update({
        where: { id: id },
        data: { status: "APPROVED" },
      });
  
      // Respond with the updated payment
      res.status(200).json({
        message: "Payment approved successfully",
        payment: updatedPayment,
      });
    } catch (error) {
      console.error("Error approving payment:", error);
      res.status(500).json({
        message: "Error approving payment",
        error: error.message,
      });
    }
  };
  
















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