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
            const query = {};
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray();
            res.send(services)
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