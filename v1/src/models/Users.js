const Mongoose = require("mongoose");
const logger = require("../scripts/loggers/Projects");

const UserSchema = new Mongoose.Schema({
    full_name: String,
    password: String,
    email: String,
    profile_image: String

}, {timestamps: true, versionKey: false})

UserSchema.post('save', (doc) => {
    logger.log({
        level: 'info',
        message: doc
    })
});

module.exports = Mongoose.model('user', UserSchema)