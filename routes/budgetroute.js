const express = require('express')


const budgetRoute =express.Router()
const budgetcontroller = require('../controllers/budgetController.js')



budgetRoute
.get('/',budgetcontroller.getBudgetCodes)
.post('/create-budget-code',budgetcontroller.createBudgetCode)




module.exports= budgetRoute;