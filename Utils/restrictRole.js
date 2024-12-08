const { Role } = require("@prisma/client");

 exports.restrictRole = (...allowedRoles) => {
     return (req, res, next) => {
   

  console.log("Allowed Roles:", allowedRoles);
  console.log("User object in request:", req.user);

          //if user and their role exist in the request object
         if (!req.user || !allowedRoles.includes(req.user.role)) {
        

             return res.status(403).json({
                 error: "You do not have permission to access this resource",
                
             });
         }
         next();
     };
 };



