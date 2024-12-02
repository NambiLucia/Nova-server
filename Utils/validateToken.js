var jwt = require("jsonwebtoken");
require("dotenv/config");

exports.validateToken = (req, res, next) => {
  // Check for the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "UNAUTHORIZED: No token provided",
    });
  }

  // Extract the token
  const token = authHeader.split(" ")[1];

  // Validate the token
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: "FORBIDDEN: Invalid or expired token",
      });
    }

    // Attach  decoded payload/user to request object and proceed
    req.user = decoded;
    next();
  });
};


























// exports.validateToken = (req, res, next) => {
//   //check headers for token
//   const authHeader = req.headers.authorization;
//   //validate token using jwt

//   if (authHeader) {
//     let token = authHeader.split(" ")[1];
//     jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
//       if (err) {
//         return res.status(403).json({
//           message: "FORBIDDEN:Failed to access token",
//         });
//       } else {
//         req.user = user;
//         next();
//       }
//     });
//   }
// };
