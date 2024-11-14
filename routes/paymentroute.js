const express = require('express')

const paymentRoute =express.Router()

const paymentcontroller = require('../controllers/paymentController')
const { schemaValidator } = require('../Utils/schema-validator')
const { paymentSchema } = require('../Utils/joi-schemas')

paymentRoute
.get('/',paymentcontroller.getPayments)
.post('/create-payment',schemaValidator(paymentSchema),paymentcontroller.createPayment)



module.exports= paymentRoute;