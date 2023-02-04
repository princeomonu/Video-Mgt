
import { MongoClient } from 'mongodb'

// Connection URL
const client = new MongoClient('mongodb://localhost:27018');

const database = "MyData"

export default async ()=>{

    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to mongdb database');

    const db = client.db(database);
    return db
}

