const { Role } = require("@prisma/client");

exports.restrictRole = (...allowedRoles) => {
    return (req, res, next) => {
        // Ensure the user and their role exist in the request object
        if (!req.user || !allowedRoles.includes(req.user.Role)) {
            return res.status(403).json({
                error: "You do not have permission to access this resource",
            });
        }
        next();
    };
};
