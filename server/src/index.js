
const express = require("express");
const readFile = require('./readFile');
const cors = require('cors');
const downloadZip = require('./downloadZip');
const unzipFile = require('./unzipFile');
const readXml = require('./readXml');
const haversineDistance = require('./haversineDistance');
const CONFIG = require('./config');

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

// TODO supprimer les fichiers zip et xml
app.get("/find", async (req, res) => {
    try {
        // Téléchargez le fichier ZIP
        const token = await downloadZip();
        await new Promise(resolve => setTimeout(resolve, 100));

        // Décompressez le fichier ZIP
        await unzipFile(token);
        
        // Lisez le fichier XML
        const xml = await readXml(token);
        
        if (xml && xml.pdv_liste && xml.pdv_liste.pdv) {
            const all_stations = xml.pdv_liste.pdv.filter(element => 
                haversineDistance({ x: req.query.x, y: req.query.y }, 
                                  { x: element.$.longitude / 100000, y: element.$.latitude / 100000 }) < CONFIG.DISTANCE_MAX
            );

            // Trouver la station avec le prix minimum pour le type de carburant spécifié
            const winner_station = all_stations.reduce((minStation, station) => {
                if (station.prix) {
                    station.prix.forEach(price => {
                        if (price.$.nom === CONFIG.FUEL_TYPE && (minStation.price_min === -1 || price.$.valeur < minStation.price_min)) {
                            minStation = { station: station, price_min: price.$.valeur };
                        }
                    });
                }
                return minStation;
            }, { station: {}, price_min: -1 }).station;

            res.json(winner_station);
        } else {
            res.status(404).json({ error: 'No stations found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});