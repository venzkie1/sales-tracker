const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://kevinmembreve32:TreatBetter@nidatracking.7guoyoc.mongodb.net/?retryWrites=true&w=majority&appName=NidaTracking";

// Replace <db_password> with your actual password
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas successfully!");
        
        // Example: Fetch database list
        const databases = await client.db().admin().listDatabases();
        console.log("Databases:", databases);

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    } finally {
        await client.close();
    }
}

connectDB();