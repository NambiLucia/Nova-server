exports.schemaValidator = (schema) => {
    return function (req, res, next) {
        const { error, value } = schema.validate(req.body);
        
        if (error) {
            return res.status(400).json({
                error: error.details[0].message
            });
        } else {
            next();
        }
    };
};
