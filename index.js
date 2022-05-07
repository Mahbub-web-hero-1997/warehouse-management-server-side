const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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
        app.get('/', async (req, res) => {
            const query = {}
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray()
            res.send(items)
        })
    }
    finally {

    }

} run().catch(console.dir)





// app.get('/', (req, res) => {
//     res.send('ddddd')
// })

app.listen(port, () => {
    console.log('Listening to port', port);
})