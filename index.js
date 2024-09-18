const express = require("express");
require('./db/config');
const User = require("./db/Users");
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const Jwt = require('jsonwebtoken');
const jwtKey = 'e-Comm';

app.post('/register', async (req, resp) => {
    let user = new User(req.body)
    let result = await user.save();
    Jwt.sign({ result }, jwtKey, (err, token) => {
        if (err) {
            resp.send({ result: "something went wrong please try after sometime" })
        }
        resp.send({ result, auth: token })
    })
    console.log(resp)
})

app.post('/login', async (req, resp) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            Jwt.sign({ user }, jwtKey, (err, token) => {
                if (err) {
                    resp.send({ result: "something went wrong please try after sometime" })
                }
                resp.send({ user, auth: token })
            })
        }
    } else {
        resp.send({ resul: 'No Data Found' })
    }
})

app.listen(4500)