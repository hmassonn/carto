
const express = require("express");
const readFile = require('./readFile');
const cors = require('cors');
const downloadZip = require('./downloadZip');
const unzipFile = require('./unzipFile');
const readXml = require('./readXml');
const { all } = require("axios");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors()); // Ajoute le middleware CORS à toutes les routes

const DISTANCE_MAX = 2; // in km
const FUEL_TYPE = 'Gazole';

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

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}
  
function haversineDistance(coord1, coord2) {
    const R = 6371; // Rayon de la Terre en kilomètres

    const lat1 = toRadians(coord1.y);
    const lon1 = toRadians(coord1.x);
    const lat2 = toRadians(coord2.y);
    const lon2 = toRadians(coord2.x);
  
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
  
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon / 2) ** 2;
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = R * c;
    return distance;
}

app.get("/find", async (req, res) => {
    let all_stations = []
    let price_min = -1;
    let winner_station = {}
    try {
        downloadZip().then((token) => {
            setTimeout(()=>{
                unzipFile(token).then(()=>{
                    readXml(token).then((xml) => {
                        if (xml && xml.pdv_liste && xml.pdv_liste.pdv) {
                            all_stations = xml.pdv_liste.pdv.filter((element) => 
                                haversineDistance({x: req.query.x, y: req.query.y}, {x: element.$.longitude / 100000, y: element.$.latitude / 100000}) < DISTANCE_MAX
                            )
                            all_stations.forEach(station => {
                                if (station.prix) {
                                    station.prix.forEach((price) => {
                                        if (price_min == -1 || (price.$.nom == FUEL_TYPE && price.$.valeur < price_min)) {
                                            price_min = price.$.valeur;
                                            winner_station = station;
                                        }
                                    })
                                }
                            });
                            res.json(winner_station)
                        }
                    });
                });
            }, 1000);
        });
    } catch (error) {
        console.error('Error :', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});