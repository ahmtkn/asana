const service = require("../services/Users");
const httpStatus = require("http-status");
const {passwordToHash, getAccessToken, generateAccessToken, generateRefreshToken} = require("../scripts/utils/helper");

const index = (req, res) => {
    service.list()
        .then((response) => res.status(httpStatus.OK).send(response))
        .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e))
}

const create = (req, res) => {
    req.body.password = passwordToHash(req.body.password);
    service.insert(req.body)
        .then((response) => res.status(httpStatus.CREATED).send(response))
        .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e))
}

const login = (req, res) => {
    req.body.password = passwordToHash(req.body.password);
    service.find(req.body).then((response) => {
        if (!response) res.status(httpStatus.NOT_FOUND).send({message: "kulkanıcı bulunamadı"});
        response = {
            ...response.toObject(),
            token: {
                access_token: generateAccessToken(response),
                refresh_token: generateRefreshToken(response),
            },
        };
        delete response.password;
        res.status(httpStatus.OK).send(response);
    }).catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e))
}

module.exports = {
    index,
    create,
    login
}