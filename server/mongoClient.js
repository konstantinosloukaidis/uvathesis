const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'thesisdata';
const client = new MongoClient(url);

let dbConnection;

async function connectToMongo() {
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB server");
        dbConnection = client.db(dbName);  // Store the database connection
    } catch (err) {
        console.error(`MongoDB connection error: ${err}`);
        process.exit(1);  // Exit the node process if connection fails
    }
}

function getDb() {
    if (!dbConnection) {
        throw new Error("No database connected!");
    }
    return dbConnection;
}

module.exports = { connectToMongo, getDb };
