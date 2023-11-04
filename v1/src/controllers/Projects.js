const service = require("../services/Projects")
const httpStatus = require("http-status");
const e = require("express");
const index = (req, res) => {
    service.list().then((response) => {
        res.status(httpStatus.OK).send(response)
    }).catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e)
    })
}

const create = (req, res) => {
    req.body.user_id = req.user;
    service.insert(req.body).then((response) => {
        res.status(httpStatus.CREATED).send(response)
    }).catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e)
    });
}

const update = (req, res) => {
    service.modify({_id: req.params.id}, req.body)
        .then((response) => res.status(httpStatus.OK).send(response))
        .catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e))
}

const destroy = (req, res) => {
    service.destroy({"id": req.params._id}).then((response) =>{
        if (!response) return res.status(httpStatus.NOT_FOUND).send({message: "proje bulunamadı"});
        res.status(httpStatus.OK).send({message: "proje başarıyla silindi"})
    }).catch(e => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e))
}


module.exports = {
    create,
    index,
    update,
    destroy
}