var express = require('express')
var app = express();
var fs = require('fs');

var publicDir = require('path').join(__dirname, '/public');
app.use(express.static(publicDir));

const engines = require('consolidate');
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

//localhost:5000
app.get('/', function (req, res) {
    res.render('index');
})
app.get('/register', function (req, res) {
    res.render('register');
})
app.get('/productmanagement', function (res, res) {
    res.render('productmanagement');
})
app.get('/accountmanagement', function (res, res) {
    res.render('accountmanagement');
})
app.get('/insert',function (res, res){
    res.render('insert')
})



/* 
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://vanhien:hienvan123@cluster0.7hfpc.mongodb.net/test";

app.post('/',async (req,res)=>{
    let inputName = req.body.txtName;
    let inputWeight = req.body.txtWeight;
    let newStudent = {name : inputName, weigh:inputWeight};

    let client= await MongoClient.connect(url);
    let dbo = client.db("StudentDB");
    await dbo.collection("Student").insertOne(newStudent);
    res.redirect('/');
})
  */
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://duczen:duczen1995@cluster0.wsxbe.mongodb.net/test";


app.post('/doRegister', async (req, res) => {
    let client = await MongoClient.connect(url);
    let inputName = req.body.txtName;
    let inputEmail = req.body.txtEmail;
    let inputNumber = req.body.txtNumber;
    let dbo = client.db("AccountDB");
    let data = {
        name: inputName,
        email: inputEmail,
        number: inputNumber,
    }
    //check data before writing to file
    if (inputName.length < 4) {
        let errorModel = {
            nameError: "Ten phai lon hon 3 ky tu!"
            , emailError: "email k hop le"
        };
        res.render('register', { model: errorModel })
    } else {
        await dbo.collection("Account").insertOne(data);
        res.redirect('/allUser');


    }
})
app.get("/allUser", async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("AccountDB");
    let result = await dbo.collection("Account").find({}).toArray();
    res.render("allUser", { model: result });
})

app.get('/remove', async (req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let client = await MongoClient.connect(url);
    let dbo = client.db("AccountDB");
    await dbo.collection("Account").deleteOne({ _id: ObjectID(id) });
    res.redirect('/');
})
//=================================================================
app.post('/doinsert', async(req,res)=>{
    let client = await MongoClient.connect(url);
    let inputName = req.body.txtNameProduct;
    let inputPrice = req.body.txtPrice;
    let inputAmount = req.body.txtAmount;
    let dbo = client.db("ZenToy");
    let data = {
        Name: inputName,
        Price: inputPrice,
        Amount: inputAmount
    }
    await dbo.collection("Product").insertOne(data);
        res.redirect('/allProduct');

})
app.get("/allProduct", async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("ZenToy");
    let result = await dbo.collection("Product").find({}).toArray();
    res.render("allProduct", { items: result });
})
app.get('/removeProduct', async (req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let client = await MongoClient.connect(url);
    let dbo = client.db("ZenToy");
    await dbo.collection("Product").deleteOne({ _id: ObjectID(id) });
    res.redirect('/allProduct');
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running in 3000 port");
});