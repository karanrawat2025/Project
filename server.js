const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from 'public' folder

// Root route to serve index.html explicitly
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Handle feedback submission
app.post('/submit-feedback', (req, res) => {
    const feedback = req.body;
    const filePath = path.join(__dirname, 'feedbacks.json');

    let feedbacks = [];
    if (fs.existsSync(filePath)) {
        feedbacks = JSON.parse(fs.readFileSync(filePath));
    }

    feedbacks.push(feedback);
    fs.writeFileSync(filePath, JSON.stringify(feedbacks, null, 2));

    res.json({ message: "Thank you for your feedback!" });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
