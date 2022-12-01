const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bqscdvk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('touristDB').collection('touristSpots');
        const serviceCollectionOfReview = client.db('touristDB').collection('allReviews');
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        })

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result)
        })
        app.get('/allservices', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const allservices = await cursor.toArray();
            res.send(allservices);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const services = await serviceCollection.findOne(query)
            // const service = serviceCollection.find(s => s._id == id);
            res.send(services);
        })

        app.get('/review', async (req, res) => {
            const query = {};
            const cursor = serviceCollectionOfReview.find(query);
            const review = await cursor.toArray();
            res.send(review);

        })

        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await serviceCollectionOfReview.insertOne(review);
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(err => console.error(err))

app.get('/', (req, res) => {
    res.send('Tourist Service Server is runing')
})
app.listen(port, () => {
    console.log('Tourist service server running', port)
})