const express = require('express')
const cors = require('cors')
const ObjectId = require('mongodb').ObjectID
const app = express()
const port = 5000
const password = 'emran1234'

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://practiseuser:emran1234@cluster0.vllde.mongodb.net/practisedb?retryWrites=true&w=majority";

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('node-mongo-crud-client'));



app.get('/', (req, res) => {
    res.sendFile('index.html')
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("practisedb").collection("items");

    //CREATE    
    app.post('/addProduct', (req, res) => {
        const product = req.body;

        collection.insertOne(product)
            .then(result => {
                res.redirect('/')
            })
    })

    //READ  
    app.get('/products', (req, res) => {
        collection.find({}).toArray((err, documents) => {
            res.send(documents)
        })
    })


    //DELETE
    app.delete('/delete/:id', (req, res) => {
        collection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0);
            })
    })

    //adding single product (kind of READ)
    app.get('/product/:id', (req, res) => {
        collection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    //UPDATE
    app.patch('/update/:id', (req, res) => {
        collection.updateOne({ _id: ObjectId(req.params.id) }, {
            $set: { price: req.body.price, quantity: req.body.quantity }
        })
            .then(result => {
                res.send(result.modifiedCount > 0);
            })
    })



})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})