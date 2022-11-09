const express = require('express');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;


///middle wires
app.use(cors());
app.use(express.json());


const USER = process.env.DB_USER
const PASSWORD = process.env.DB_PASSWORD



const uri = `mongodb+srv://${USER}:${PASSWORD}@cluster0.qlqg855.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    // console.log(authHeader)
    if (!authHeader) {
        return res.status(401).send({ message: 'Unauthorized access' })
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (error, decoded) {
        if (error) {
            return res.status(401).send({ message: 'Unauthorized access' })
        }
        req.decoded = decoded;
        next();
    })
}

async function run() {

    try {
        const serviceCollection = client.db('rtr-cloud-kitchen').collection('services');
        const reviewCollection = client.db('rtr-cloud-kitchen').collection('review')


        app.post('/jwt', (req, res) => {
            const user = req.body;
            // console.log(user);
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10h' })
            res.send({ token });
        })


        app.get('/services', async (req, res) => {
            const query = req.query.limit || 0;
            const cursor = serviceCollection.find({}).sort({ _id: -1 });
            const services = await cursor.limit(parseInt(query)).toArray();
            res.send(services)
        })

        app.post('/services', async (req, res) => {
            const service = req.body;
            // console.log(service);
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id)
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query)
            res.send(service);
        })

        app.get('/review/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id)
            const query = { _id: ObjectId(id) };
            const review = await reviewCollection.findOne(query)
            res.send(review);
        })



        app.post('/review', async (req, res) => {
            const review = req.body;
            // console.log(review);
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

       



        app.get('/review', verifyJWT, async (req, res) => {
            // console.log(req.headers.authorization)
            let query = {};

            const decoded = req.decoded;
            const serviceId = req.query.serviceId;
            


         
            if (!serviceId) {
                

                if (decoded.email !== req.query.email) {
                    res.status(403).send({ message: 'Unauthorized access' })
                }

                if (req.query.email) {
                    query = {
                        email: req.query.email
                    }
                }

                const cursor = reviewCollection.find(query).sort({ _id: -1 }, { time: -1 }, { date: -1 });
                const review = await cursor.toArray();
                res.send(review);

            }

            else{
                console.log('serviceid')
                if (req.query.serviceId) {
                    query = {
                        serviceId: req.query.serviceId
                    }
                }

                const cursor = reviewCollection.find(query).sort({ _id: -1 }, { time: -1 }, { date: -1 });
                const review = await cursor.toArray();
                res.send(review);

            }


            



        })







        app.delete('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })

        app.patch('/review/:id', async (req, res) => {
            const id = req.params.id;
            const review = req.body.review
            const query = { _id: ObjectId(id) };
            const updatedDoc = {
                $set: {
                    review: review
                }
            }
            const result = await reviewCollection.updateOne(query, updatedDoc)
            res.send(result);
        })


    }
    finally {

    }

}

run().catch(error => console.log(error))




app.get('/', (req, res) => {
    res.send("RTR Cloud Kitchen Server is running")
});

app.listen(port, () => {
    console.log(`RTR Cloud Kitchen Server running on ${port}`);
})