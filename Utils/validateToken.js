var jwt = require("jsonwebtoken");
require("dotenv/config");

exports.validateToken = (req, res, next) => {
  //check headers for token
  const authHeader = req.headers.authorization;
  //validate token using jwt

  if (authHeader) {
    let token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({
          message: "FORBIDDEN:Failed to access token",
        });
      } else {
        req.user = user;
        next();
      }
    });
  }
};
