const express = require('express')

const userRoute =express.Router()

const usercontroller = require('../controllers/userController')
const { register } = require('module')

userRoute
.get('/',usercontroller.getUsers)
.post('/register',usercontroller.register)


module.exports= userRoute;