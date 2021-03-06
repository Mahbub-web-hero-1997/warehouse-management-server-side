const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require('express/lib/response');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_Pass}@cluster0.wulpo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const itemCollection = client.db('warehouseItems').collection('items');
        // Get Multiple Item
        app.get('/items', async (req, res) => {
            const query = {}
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray()
            res.send(items)
        })
        // get single item by id
        app.get('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const items = await itemCollection.findOne(query)
            res.send(items);
        })
        // update item
        app.put('/items/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const query = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    quantity: data.quantity
                }
            };
            const item = await itemCollection.updateOne(query, updateDoc, options)
            res.send(item);
        })
        // delete item
        app.delete('/items/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) }
            const result = await itemCollection.deleteOne(query);
            res.send(result)
        })

        // Add items
        app.post('/items', async (req, res) => {
            const newItem = req.body;
            console.log(newItem);
            const result = await itemCollection.insertOne(newItem)
            res.send(result)
        })


    }
    finally {

    }

} run().catch(console.dir)

app.listen(port, () => {
    console.log('Listening to port', port);
})