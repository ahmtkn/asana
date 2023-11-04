const service = require("../services/Users");
const httpStatus = require("http-status");
const {passwordToHash, getAccessToken, generateAccessToken, generateRefreshToken} = require("../scripts/utils/helper");
const uuid = require("uuid");
const eventEmitter = require('../scripts/events/eventEmitter');
const projectService = require("../services/Projects");
const path = require("path");

const index = (req, res) => {
    const event = require('events');
    const eventEmitter = new event.EventEmitter();
    eventEmitter.on('send_email', (data) => {
        console.log('sendEmail', data);
    });

    eventEmitter.emit('send_email', {name: 'test'});
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

const update = (req, res) => {
    if (req.body.password) req.body.password = passwordToHash(req.body.password);
    service.modify({'_id': req.user._id}, req.body).then((response) => {
        req.user = response;
        res.status(httpStatus.OK).send(response);
    }).catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
}

const login = (req, res) => {
    req.body.password = passwordToHash(req.body.password);
    service.find(req.body).then((response) => {
        if (!response) return res.status(httpStatus.NOT_FOUND).send({message: "kullanıcı bulunamadı"});
        response = {
            ...response.toObject(),
            token: {
                access_token: generateAccessToken(response),
                refresh_token: generateRefreshToken(response),
            },
        };
        delete response.password;
        return res.status(httpStatus.OK).send(response);
    }).catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
}

const projectList = (req, res) => {
    projectService.list({"user_id": req.user._id}).then((response) => {
        return res.status(httpStatus.OK).send(response);
    }).catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
}

const resetPassword = (req, res) => {
    const newPassword = uuid.v4()?.split("-")[0] || `usr-${Date().getTime()}`;
    service.modify({"email": req.body.email}, {password: passwordToHash(newPassword)}).then((response) => {
        if (!response) res.status(httpStatus.NOT_FOUND).send({message: "Password resetleme sırasında bir hata oluştu"});
        eventEmitter.emit('send_email', {
            to: response.email, // list of receivers
            subject: "Password Reset ✔", // Subject line
            html: `Tablebiniz üzerine şifreniz yenilenmiştir. Yeni Şifrenizz: ${newPassword}`, // html body
        });
        res.status(httpStatus.OK).send({message: "Yeni şifreniz mail adresinize gönderilmiştir."});
    }).catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));

}

const destroy = (req, res) => {
    service.destroy({"_id": req.params.id}).then((response) => {
        if (!response) return res.status(httpStatus.NOT_FOUND).send({message: "kullanıcı bulunamadı"});
        res.status(httpStatus.OK).send({message: "kullanıcı başarıyla silindi"});
    }).catch(() => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({message: "kullanıcı silinirken bir hata oluştu"}));
}

const changePassword = (req, res) => {
    if (req.body.password) req.body.password = passwordToHash(req.body.password);
    service.modify({'_id': req.user._id}, req.body).then((response) => {
        req.user = response;
        res.status(httpStatus.OK).send(response);
    }).catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
}

const updateProfileImage = (req, res) => {
    if (!req?.files?.profile_image) {
        return res.status(httpStatus.BAD_REQUEST).send({"error": "Bu işlemi yapabilmek için yeterli veriye sahip değilsiniz"});
    }
    const extension = path.extname(req?.files?.profile_image.name);
    const fileName = `${req?.user?._id}${extension}`;
    const folderPath = path.join(__dirname, "../uploads/users", fileName);
    req.files.profile_image.mv(folderPath, function (err) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({"error": err});
        service.modify({"_id": req?.user?._id}, {"profile_image": fileName}).then((response) => {
            return res.status(httpStatus.OK).send(response);
        }).catch((e) => {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({"message": "Upload başarılı fakat kayıt sırasında bir sorun oluştu."});
        });
    });
}

module.exports = {
    index,
    create,
    update,
    login,
    projectList,
    resetPassword,
    destroy,
    changePassword,
    updateProfileImage
}