const CryptoJs = require("crypto-js");
const JWT = require("jsonwebtoken");
const passwordToHash = (password) => {
    return CryptoJs.SHA256(password, CryptoJs.HmacSHA1(password, process.env.PASSWORD_HASH).toString()).toString()
}

const generateAccessToken = (user) => {
    return JWT.sign({name:user.full_name, ...user}, process.env.ACCESS_TOKEN_SECRET_KEY, {expiresIn: '1w'});
}

const generateRefreshToken = (user) => {
    return JWT.sign({name:user.full_name, ...user}, process.env.REFRESH_TOKEN_SECRET_KEY);
}

module.exports = {
    passwordToHash,
    generateAccessToken,
    generateRefreshToken
}