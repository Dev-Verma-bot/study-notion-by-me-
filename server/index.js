const express = require("express");
const App = express();

const cource_route = require("./Route/cource_route");
const payment_route = require("./Route/payment_route");
const user_route = require("./Route/user_route");
const profile_route = require('./Route/profile_route');

const cookie_parser = require("cookie-parser");
const cors = require("cors");
const file_upload = require("express-fileupload");
const db_connect = require("./config/database_connect");
const { cloudinary_connect } = require("./config/cloudinary_connect");

require("dotenv").config();

const port = process.env.PORT || 4000;
cloudinary_connect();
db_connect();

App.use(express.json());
App.use(cookie_parser());
App.use(file_upload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

App.use(cors({
  origin: 'https://study-notion-by-me.vercel.app',
  credentials: true
}));

App.use("/study_notion/cource", cource_route);
App.use("/study_notion/payment", payment_route);
App.use("/study_notion/user", user_route);
App.use("/study_notion/user_profile", profile_route);

App.get("/", async (req, res) => {
  res.send("On homepage!");
});

App.listen(port, () => {
  console.log(`✅ Server started successfully on port ${port}`);
});
