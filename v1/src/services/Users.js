const User = require("../models/Users")
const insert = (data) => {
    const user = User(data);
    return user.save()
}

const list = () => {
    return User.find({});
}

const find = (user) => {
    return User.findOne(user);
}


module.exports = {
    insert,
    list,
    find
}