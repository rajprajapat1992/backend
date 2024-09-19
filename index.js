const express = require("express");
require('./db/config');
const User = require("./db/Users");
const Product = require("./db/Product")
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const Jwt = require('jsonwebtoken');
const jwtKey = 'e-Comm';

app.post('/register', async (req, resp) => {
    const { email } = req.body;
    let exists = await User.findOne({email})
    if(exists){ 
        return resp.status(404).json({
        status : 404,
        message : "Data already exists."
    })}
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

app.post("/add-product", async (req, resp) =>{
    let product = new Product(req.body);
    let result = await product.save();
    resp.send(result)
})

app.get("/products", async (req, resp) =>{
    let products = await Product.find();
    if(products.length > 0){
        resp.send(products)
    }else{
        resp.send({message: 'no product found'})
    }
})
app.delete("/delete/:id", async (req, resp) =>{
    const result = await Product.deleteOne({_id: req.params.id});
    resp.send(result)
})

app.listen(4500)