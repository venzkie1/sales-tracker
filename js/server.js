const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const {ObjectId} = require('mongodb');

const app = express();
app.use(express.json());
app.use(cors()); // Allow frontend requests

// Connect to MongoDB
mongoose.connect('mongodb+srv://kevinmembreve32:TreatBetter@nidatracking.7guoyoc.mongodb.net/?retryWrites=true&w=majority&appName=NidaTracking', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Define Schema
const softDrinkSchema = new mongoose.Schema({
    dateTime: String,
    category: String,
    item: String,
    quantity: Number,
    total: Number
});

const gcashSchema = new mongoose.Schema({
    dateTime: String,
    amount: Number,
    fee: Number,
    total: Number
});

const SoftDrink = mongoose.model('SoftDrink', softDrinkSchema);
const Gcash = mongoose.model('GCash', gcashSchema);

// API Route to Save Data
app.post('/api/softdrinks', async (req, res) => {
    try {
        await SoftDrink.insertMany(req.body);
        res.status(201).send("Data saved successfully!");
    } catch (error) {
        res.status(500).send("Error saving data");
    }
});

// API Route to Fetch Data
// Soft Drinks
app.get('/api/softdrinks', async (req, res) => {
    try {
        const softDrinks = await SoftDrink.find(); // Fetch all records
        res.json(softDrinks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data" });
    }
});

app.delete('/api/softdrinks/:id', async (req, res) => {
    const { id } = req.params;
    console.log("Deleting entry with _id:", id); // Debugging

    try {
        const result = await db.collection('softdrinks').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Entry not found' });
        }
        res.json({ message: 'Entry deleted successfully' });
    } catch (error) {
        console.error('Error deleting entry:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GCASH
app.post('/api/gcash', async (req, res) => {
    try {
        await Gcash.insertMany(req.body);
        res.status(201).send("GCash transaction saved successfully!");
    } catch (error) {
        res.status(500).send("Error saving GCash transaction");
    }
});

app.get('/api/gcash', async (req, res) => {
    try {
        const gcashTransactions = await Gcash.find(); // Fetch all GCash transactions
        res.json(gcashTransactions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching GCash data" });
    }
});

app.delete('/api/gcash/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.collection('gcash').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting transaction" });
    }
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
