const { describe, test, expect, beforeAll } = require("@jest/globals");
const request = require("supertest");
const app = require("../server");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const user = {
  fullname: "testname",
  email: "test@email.com",
  password: "testing",
  role: "ADMIN",
};

beforeAll(async () => {
  await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });
});
describe("User tests", () => {
  test("Should fail if user created has no role", async () => {
    // Send the request to create a user without the 'role' field
    await request(app)
      .post("/api/v1/users/register")
      .send({
        fullname: user.fullname,
        email: user.email,
        password: user.password,
      })

      // Assert that the response has a 400 status code
      .expect(400)
     
  });

  test("Should fail if User ID is missing", async () => {
      await request(app)
      .patch("/api/v1/users/update-user/") //missing ID
      .send({
        fullname: user.fullname,
        email: user.email,
        password: user.password,
      })
      .expect(404) 
 
  });
});

describe("account codes test", () => {
  test("Should pass when all account codes are displayed", async () => {
     await request(app)
      .get("/api/v1/accountcodes")
      .expect(200)
 
  });
});
