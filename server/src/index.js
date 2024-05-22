
const express = require("express");
const readFile = require('./readFile');
const cors = require('cors');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors()); // Ajoute le middleware CORS à toutes les routes

app.get("/api", async (req, res) => {
  try {
      const data = await readFile.asynchronously("data.json");
      res.json(data);
  } catch (error) {
      console.error('Error reading or parsing the file:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.get("/search", async (req, res) => {
    try {
        const data = await fetch("https://api-adresse.data.gouv.fr/search?q="+req.query.q)
        const result = await data.json()
        res.json(result)
    } catch (error) {
        console.error('Error :', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});