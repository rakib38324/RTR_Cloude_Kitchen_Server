const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');


const app = express();
const port = process.env.PORT || 5000;


///middle wires
app.use(cors());
app.use(express.json());


const USER = process.env.DB_USER
const PASSWORD = process.env.DB_PASSWORD



const uri = `mongodb+srv://${USER}:${PASSWORD}@cluster0.qlqg855.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });






app.get('/',(req,res)=>{
    res.send("RTR Cloud Kitchen Server is running")
});

app.listen(port, ()=>{
    console.log(`Genius car server running on ${port}`);
})