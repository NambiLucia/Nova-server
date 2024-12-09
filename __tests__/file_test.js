const { describe, test, expect } = require("@jest/globals");
const request = require("supertest");
const app = require("../server");

const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVhYzFlM2ZjLTZlNWYtNDAyZC1iN2UwLWU3YWQwNTUwZWNmNSIsImVtYWlsIjoiZGFtaUBlbWFpbC5jb20iLCJpYXQiOjE3MzI3MDAyMjcsImV4cCI6MTczMjcwMzgyN30.xBQACc2F3m5rX_PHokQ96PWTQlttBRqHqkyo0pOJ_fk";

const payment = {
  date: "2024-11-26T00:00:00Z",
  voucherNo: 8,
  payee: "Macy",
  paymentDetails: "Accounts department",
  accountCode: "ACC-001",
  beneficiaryCode: "BEN-001",
  budgetCode: "BUD-001",
  exchangeRate: 3600,
  amountFigures: 4000,
  amountWords: "Four thousand shillings only",
  status: "INITIATED",
};

describe("Payment Creation tests", () => {
  test("should fail when PDF file isn't attached", async () => {
    const response = await request(app)
      .post("/api/v1/payments/create-payment")
      .set("Authorization", `Bearer ${authToken}`)
      .field("date", payment.date)
      .field("voucherNo", payment.voucherNo)
      .field("payee", payment.payee)
      .field("paymentDetails", payment.paymentDetails)
      .field("accountCode", payment.accountCode)
      .field("beneficiaryCode", payment.beneficiaryCode)
      .field("budgetCode", payment.budgetCode)
      .field("exchangeRate", payment.exchangeRate)
      .field("amountFigures", payment.amountFigures)
      .field("amountWords", payment.amountWords)
      .field("status", payment.status)

      .expect(400);
    expect(response.body.error).toBe("PDF file is required");
  });

  







});
