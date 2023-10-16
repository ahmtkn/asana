const User = require("../models/Users")

const list = () => {
    return User.find({});
}

const find = (user) => {
    return User.findOne(user);
}

const insert = (data) => {
    const user = User(data);
    return user.save()
}

const modify = (where, data) => {
    return User.findOneAndUpdate(where, data, {new: true});
}


module.exports = {
    list,
    find,
    insert,
    modify
}