const express = require("express");
const helmet = require("helmet");
const config = require("./config");
const loaders = require("./loaders");
const { ProjectRoutes} = require("./api-routes");
const { UserRoutes } = require("./api-routes")
const events = require("./scripts/events");

config();
loaders();
events();

const app = express();
app.use(express.json());
app.use(helmet());


app.listen(process.env.APP_PORT,() => {
    console.log("sunucu ayağa kaltı")
    app.use("/projects", ProjectRoutes)
    app.use("/users", UserRoutes)
})