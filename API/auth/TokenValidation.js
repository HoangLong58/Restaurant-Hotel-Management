const { verify } = require("jsonwebtoken");

module.exports = {
    checkToken: (req, res, next) => {
        let token = req.get("authorization");
        if (token) {
            token = token.slice(7);
            verify(token, process.env.JWT_SEC, (err, decoded) => {
                if (err) {
                    res.json({
                        status: "fail",
                        message: "Invalid token"
                    });
                } else {
                    next();
                }
            });
        } else {
            res.json({
                status: "fail",
                message: "Access denied! Unauthorized user"
            });
        }
    }
}