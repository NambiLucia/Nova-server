const express = require('express')
const { schemaValidator } = require('../Utils/schema-validator')
const { codeSchema } = require('../Utils/joi-schemas')


const budgetRoute =express.Router()
const budgetcontroller = require('../controllers/budgetController.js')



budgetRoute
.get('/',budgetcontroller.getBudgetCodes)
.post('/create-budget-code',schemaValidator(codeSchema),budgetcontroller.createBudgetCode)
.patch('/update-budget-code/:id',schemaValidator(codeSchema),budgetcontroller.updateBudgetCodeById)
.delete('/delete-budget-code/:id',budgetcontroller.deleteBudgetCodeById)


module.exports= budgetRoute;

