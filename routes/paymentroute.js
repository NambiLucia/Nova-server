const express = require("express");

const paymentRoute = express.Router();

const paymentcontroller = require("../controllers/paymentController");
const { schemaValidator } = require("../Utils/schema-validator");
const { paymentSchema } = require("../Utils/joi-schemas");
const { validateToken } = require("../Utils/validateToken");

paymentRoute
  .get("/", paymentcontroller.getPayments)
  .get("/limit", paymentcontroller.getSomePayments)
  .get("/sort", paymentcontroller.sortpaymentsByDate)
  .post(
    "/create-payment",
    //schemaValidator(paymentSchema),
    validateToken,
    paymentcontroller.uploadDocs,
    paymentcontroller.createPayment
  )
  .patch("/update-payment/:id",paymentcontroller.updatePaymentById)
  .delete('/delete-payment/:id',validateToken,paymentcontroller.deletePaymentById)

module.exports = paymentRoute
