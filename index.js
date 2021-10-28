const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb')
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

// Replace the following with your MongoDB deployment's connection string.
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6bdcv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
   const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
            await client.connect()
            console.log('conected to database')
            const database = client.db("services");

            const servicesCollection = database.collection("service");
            
            //find by id api
            app.get('/service/:id', async(req,res)=>{
                const id = req.params.id;
                const quary = {_id: ObjectId(id) }
                const service = await servicesCollection.findOne(quary)
                res.send(service)
            })
            // delete api
            app.delete('/service/:id', async (req, res)=>{
                const id = req.params.id;
                const quary = {_id:ObjectId(id)}
                const result = await servicesCollection.deleteOne(quary)
                res.json(result)
            }) 


            //get Api
            app.get('/service', async (req, res)=>{
                    const cursor = servicesCollection.find({});
                    const services = await cursor.toArray();
                    res.send(services)
            })
            //post api
            app.post('/service', async (req, res)=>{
                const service = req.body;
                console.log('hiting post api')
                const result = await servicesCollection.insertOne(service);
                res.json(result)
            })
        }
    finally{
    //    await client.close()
    }
}
run().catch(console.dir)

   app.get('/', (req, res)=>{
    res.send('Running genius car server....')
})


app.listen(port, ()=>{
    console.log('listening to port:', port)
})