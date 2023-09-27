const httpStatus = require("http-status");
const JWT = require("jsonwebtoken");
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1] || null;

    if (token === null) res.status(httpStatus.UNAUTHORIZED).send({message: "Bu işlemi yapmak için ilk önce giriş yapmalısınız"});

    JWT.verify(token,process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
        if (err) res.status(httpStatus.FORBIDDEN).send({ error: err });
        req.user = user;
        next()
    })
}

module.exports = authenticateToken