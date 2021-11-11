const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d4vnz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db("bagdb");
    const serviceCollection = database.collection("service");
    const orderCollection = database.collection("order");
    // create a document to insert
    
    //POST SERVICE API
     app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service)
            res.json(result)
        })

     //GET SERVICE API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({})
            const service = await cursor.toArray();
            res.send(service)
        })

     //GET SINGLE API
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query);
            res.json(service)
        })
    
        //POST API FOR ORDER
        app.post('/order', async (req, res) => {
            const newOder = req.body;
            const result = await orderCollection.insertOne(newOder)
            res.json(result)
        })
    
     //GET FOR MY ORDER
        app.get('/myOrder/:email', async (req, res) => {
            const result = await orderCollection.find({ email: req.params.email }).toArray()
            res.send(result)
        })

        //DELETE MY ORDER API
        app.delete('/myOrder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query)
            res.json(result)
        })
    
     // GET API FOR MANAGE
        app.get('/manage', async (req, res) => {
            const cursor = orderCollection.find({})
            const orders = await cursor.toArray();
            res.send(orders)
        })


        //UPDATE STATUS
        app.put('/status/:id', async (req, res) => {
            const id = req.params.id;
            const updateStatus = req.body;
            const filter = { _id: ObjectId(id) }
            const updateDoc = {
                $set: {
                    status: updateStatus.status,
                },
            };
            const result = await orderCollection.updateOne(filter, updateDoc);
            res.json(result)
        })


        //Delete TO MANAGE
        app.delete('/manage/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query)
            res.json(result)
        })

    
   
  } finally {
   // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Assignment 12')
})

app.listen(port, () => {
  console.log('Assignment server', port)
})