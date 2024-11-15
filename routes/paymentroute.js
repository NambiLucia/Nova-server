const express = require('express')

const paymentRoute =express.Router()

const paymentcontroller = require('../controllers/paymentController')
const { schemaValidator } = require('../Utils/schema-validator')
const { paymentSchema } = require('../Utils/joi-schemas')
const { validateToken } = require('../Utils/validateToken')


paymentRoute
.get('/',paymentcontroller.getPayments)
.post('/create-payment',schemaValidator(paymentSchema),validateToken, paymentcontroller.createPayment)



module.exports= paymentRoute;