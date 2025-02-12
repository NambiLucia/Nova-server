const express = require('express')

const userRoute =express.Router()

const usercontroller = require('../controllers/userController')
const { register } = require('module')
const { userSchema } = require('../Utils/joi-schemas')
const { schemaValidator } = require('../Utils/schema-validator')

userRoute
.get('/',usercontroller.getUsers)
.get("/reset-password", (req, res) => {
    res.send("Reset password page");
  })
.post('/register',schemaValidator(userSchema),usercontroller.register)
.post('/login',usercontroller.login)
.patch('/update-user/:id',usercontroller.updateUserById)
.delete('/delete-user/:id',usercontroller.deleteUserById)
.post('/forgot-password',usercontroller.forgotPassword)
.post('/reset-password',usercontroller.resetPassword)




module.exports= userRoute;