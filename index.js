const express = require('express');
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

console.log(USER, PASSWORD)

const uri = `mongodb+srv://${USER}:${PASSWORD}@cluster0.qlqg855.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){

    try{
        const serviceCollection = client.db('rtr-cloud-kitchen').collection('services');
      

        app.get('/services',async (req,res)=>{
            const query = req.query.limit || 0;
            const cursor = serviceCollection.find({}).sort({_id:-1})
            const services = await cursor.limit(parseInt(query)).toArray();
            res.send(services)
        })

        app.post('/services',async (req,res)=>{
            const service = req.body;
            console.log(service);
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        })

        app.get('/services/:id',async(req,res)=>{
            const id = req.params.id;

            const query = {_id: ObjectId(id)};

            const service = await serviceCollection.findOne(query)
            res.send(service);
        })
       

    }
    finally{

    }

}

run().catch(error => console.log(error))




app.get('/',(req,res)=>{
    res.send("RTR Cloud Kitchen Server is running")
});

app.listen(port, ()=>{
    console.log(`RTR Cloud Kitchen Server running on ${port}`);
})