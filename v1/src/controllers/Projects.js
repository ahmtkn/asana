const { insert, list, modify } = require("../services/Projects")
const httpStatus = require("http-status");
const e = require("express");
const index = (req, res) => {
    list().then((response) => {
        res.status(httpStatus.OK).send(response)
    }).catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e)
    })
}

const create = (req, res) => {
    req.body.user_id = req.user;
    insert(req.body).then((response) => {
        res.status(httpStatus.CREATED).send(response)
    }).catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e)
    });
}

const update = (req, res) => {
    modify({_id: req.params.id}, req.body)
        .then((response) => res.status(httpStatus.OK).send(response))
        .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e))
}


module.exports = {
    create,
    index,
    update
}