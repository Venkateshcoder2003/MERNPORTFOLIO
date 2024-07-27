require("dotenv").config();

const express = require('express');
const app = express();

const cors = require('cors')
//adding  mongoose
require("./db/conn");
//importing router from Routes folder
const router = require('./Routes/router');

const port = process.env.PORT || 6002;

app.use(cors());
app.use(express.json());

app.use(router);

app.listen(port, () => {
    console.log("Server Running...")
})
