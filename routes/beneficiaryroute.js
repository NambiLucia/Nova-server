const express = require('express')
const { schemaValidator } = require('../Utils/schema-validator')
const { codeSchema } = require('../Utils/joi-schemas')


const beneficiaryRoute =express.Router()
const beneficiarycontroller = require('../controllers/beneficiaryController')



beneficiaryRoute
.get('/',beneficiarycontroller.getBeneficiaryCodes)
.post('/create-beneficiary-code',schemaValidator(codeSchema),beneficiarycontroller.createBeneficiaryCode)
.patch('/update-beneficiary-code/:id',schemaValidator(codeSchema),beneficiarycontroller.updateBeneficiaryCodeById)
.delete('/delete-beneficiary-code/:id',beneficiarycontroller.deleteBeneficiaryCodeById)


module.exports= beneficiaryRoute;

