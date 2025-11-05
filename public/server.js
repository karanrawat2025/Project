// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Route to serve main feedback form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route to handle feedback submission
app.post("/submit-feedback", (req, res) => {
  const { name, email, feedback } = req.body;

  const feedbackEntry = `Name: ${name}\nEmail: ${email}\nFeedback: ${feedback}\n-----------------------\n`;

  fs.appendFile("feedback.txt", feedbackEntry, (err) => {
    if (err) {
      console.error("Error saving feedback:", err);
      return res.status(500).send("Error saving feedback");
    }
    console.log("Feedback saved successfully!");
    res.sendFile(path.join(__dirname, "public", "thankyou.html"));
  });
});

// Route to view all feedbacks
app.get("/view-feedback", (req, res) => {
  fs.readFile("feedback.txt", "utf8", (err, data) => {
    if (err || !data.trim()) {
      return res.send(`
        <html>
          <head>
            <title>Submitted Feedbacks</title>
            <style>
              body { font-family: 'Poppins', sans-serif; background: #f8f9fa; text-align: center; padding: 60px; color: #555; }
              h2 { color: #888; }
              a { text-decoration: none; color: #4CAF50; display: inline-block; margin-top: 20px; }
              a:hover { text-decoration: underline; }
            </style>
          </head>
          <body>
            <h2>No feedbacks found yet.</h2>
            <a href="/">← Back to Form</a>
          </body>
        </html>
      `);
    }

    const entries = data
      .split("-----------------------")
      .filter(line => line.trim() !== "")
      .map(entry => `<li>${entry.replace(/\n/g, "<br>")}</li>`)
      .join("");

    res.send(`
      <html>
        <head>
          <title>Submitted Feedbacks</title>
          <style>
            body { font-family: 'Poppins', sans-serif; background: linear-gradient(135deg, #a8edea, #fed6e3); padding: 40px; }
            h1 { text-align: center; color: #333; margin-bottom: 30px; }
            ul { list-style-type: none; padding: 20px; background: white; border-radius: 15px; max-width: 800px; margin: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            li { background: #f9f9f9; margin: 15px 0; padding: 15px; border-radius: 10px; border-left: 5px solid #4CAF50; transition: 0.3s; }
            li:hover { background: #f1f1f1; transform: scale(1.02); }
            a { display: block; text-align: center; margin-top: 30px; color: white; background: #4CAF50; padding: 10px 20px; border-radius: 8px; text-decoration: none; width: 200px; margin-left: auto; margin-right: auto; }
            a:hover { background: #45a049; }
          </style>
        </head>
        <body>
          <h1>All Submitted Feedbacks</h1>
          <ul>${entries}</ul>
          <a href="/">← Back to Feedback Form</a>
        </body>
      </html>
    `);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
