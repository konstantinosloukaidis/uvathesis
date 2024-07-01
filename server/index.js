const express = require("express");
const { connectToMongo, getDb } = require("./mongoClient");
const bodyParser = require('body-parser');
const serverIdentifier = require('./serverIdentifier');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(bodyParser.json());

const logOn = false; // Change for evaluation

(async () => {
    const serverId = await serverIdentifier();

    connectToMongo().then(() => {
        app.listen(PORT, () => {
            console.log(`Server listening on ${PORT}`);
            console.log(`Server identifier: ${serverId}`);
        });
    }).catch(err => {
        console.error("Failed to connect to MongoDB", err);
    });

    app.get("/api/:country_code", async (req, res) => {
        try {
            const db = getDb();
            const results = db.collection('datacollection').find({ "country": req.params.country_code });
            let documents = [];
            for await (const doc of results) {
                documents.push(doc);
            }
            res.json({ data: documents });
        } catch (error) {
            res.status(500).json({ error: error.toString() });
        }
    });

    app.post('/api/log', async (req, res) => {
        if (logOn) {
            const doc = {
                ...req.body,
                timestamp: new Date(req.body.timestamp),
                serverId: serverId
            }
            const db = getDb();
            await db.collection('logs').insertOne(doc);
        }
        
        try {
            res.status(200).send('Log saved');
        } catch (error) {
            res.status(500).send('Error saving log');
        }
    });

    app.get("/api/document/:filename", async (req, res) => {
        try {
            const db = getDb();
            const result = await db.collection('datacollection').findOne({"filename": req.params.filename});
            res.json({ data: result });
        } catch (error) {
            res.status(500).json({ error: error.toString() });
        }
    });

    process.on('SIGINT', () => {
        client.close().then(() => {
            console.log('MongoDB disconnected on app termination');
            process.exit(0);
        });
    });
})();

