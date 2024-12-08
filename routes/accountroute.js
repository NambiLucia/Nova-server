const express = require('express')
const { schemaValidator } = require('../Utils/schema-validator')
const { codeSchema } = require('../Utils/joi-schemas')


const accountRoute =express.Router()
const accountcontroller = require('../controllers/accountController')



accountRoute
.get('/',accountcontroller.getAccountCodes)
.post('/create-account-code',schemaValidator(codeSchema),accountcontroller.createAccountCode)
.patch('/update-account-code/:id',schemaValidator(codeSchema),accountcontroller.updateAccountCodeById)
.delete('/delete-account-code/:id',accountcontroller.deleteAccountCodeById)


module.exports= accountRoute;

