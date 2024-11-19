const express = require('express')


const documentRoute =express.Router()
const documentcontroller = require('../controllers/documentController')



documentRoute
.get('/',documentcontroller.getDocuments)




module.exports= documentRoute;