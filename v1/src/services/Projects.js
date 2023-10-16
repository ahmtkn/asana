const Project = require('../models/Projects')

const list = () => {
    return Project.find({}).populate({
        path: "user_id",
        select: "full_name email"
    });
}

const insert = (projectData) => {
    const projects = Project(projectData);
    return projects.save();
}
const modify = (where, data) => {
    return Project.findOneAndUpdate(where, data, {new: true})
}


module.exports = {
    insert,
    list,
    modify
}